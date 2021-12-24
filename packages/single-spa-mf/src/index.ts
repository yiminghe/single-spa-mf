import {
  addErrorHandler,
  checkActivityFunctions,
  getAppNames,
  registerApplication as registerApplication2,
  navigateToUrl,
  LifeCycles,
} from 'single-spa';
import { getMFAppEntry, getMFAppVar } from './utils';
import * as webpack from './webpack';
// @ts-ignore
import md5 from 'blueimp-md5';

export { webpack };

const resolvedPromise = Promise.resolve();

export interface MFAppHandle {
  mount: (el: HTMLElement) => Promise<void> | void;
  unmount: (el: HTMLElement) => Promise<void> | void;
}

const defaultManifestFileName = 'manifest.json';

export interface MFApp {
  activeFn: (location: Location) => boolean;
  /** main app module */
  main?: () => Promise<LifeCycles<any>>
  /** app public url */
  app?: string;
  customProps?: any;
  loader?: MFAppHandle;
  error?: MFAppHandle;
  /** whether check manifest to update, default do not check manifest: cache true */
  cache?: boolean;
  /** defaults to manifest.json */
  manifestFileName?: string;
}

export type MFApps = Record<string, MFApp>;

export function initMFApps(apps: MFApps) {
  async function load<T>(fn: () => Promise<T>, id: string): Promise<T> {
    const applicationElement = getApplicationElement(id)!;
    const app = apps[id];
    let showed: Promise<void> | undefined;
    let loadingTimeout = setTimeout(() => {
      if (app?.loader) {
        showed = app.loader.mount(applicationElement) || resolvedPromise;
      }
    }, 100);
    try {
      const ret = await fn();
      if (showed) {
        await showed;
        if (app?.loader) {
          await app.loader.unmount(applicationElement);
        }
      }
      return ret;
    } finally {
      clearTimeout(loadingTimeout);
    }
  }

  async function loadApp(appName: string, app: MFApp) {
    return load(() => importApp(appName, app, 'main'), appName);
  }


  function registerApplication(appName: string, app: MFApp) {
    registerApplication2(
      appName,
      () => loadApp(appName, app),
      app.activeFn,
      app.customProps,
    );
  }

  function registerMainApplication(app: string, loader: () => Promise<LifeCycles<any>>, check: (l: Location) => boolean, customProps: any) {
    registerApplication2(
      app,
      () => load(() => loader(), app),
      check,
      customProps,
    );
  }

  const appNames = Object.keys(apps);

  for (const appName of appNames) {
    const app = apps[appName];
    if (app.main) {
      registerMainApplication(appName, app.main, app.activeFn, app.customProps);
    } else if (app.app) {
      registerApplication(appName, app);
    }
  }

  const errors: Record<
    string,
    {
      applicationElement: HTMLElement;
      mountPromise: Promise<void>;
    }
  > = {};

  addErrorHandler((err) => {
    const id = err.appOrParcelName;
    const applicationElement = getApplicationElement(id)!;
    const app = apps[id];
    if (app?.error) {
      const mountPromise = app.error.mount(applicationElement) || resolvedPromise;
      errors[id] = { applicationElement, mountPromise };
    }
  });

  window.addEventListener(
    'single-spa:before-routing-event',
    ({ detail: { newUrl, cancelNavigation } }: any) => {
      const promises: Promise<void>[] = [];
      getAppsToUnmount(newUrl).forEach((name) => {
        if (errors[name]) {
          const app = apps[name];
          if (app?.error) {
            promises.push(errors[name].mountPromise);
            promises.push(
              app.error.unmount(errors[name].applicationElement) ||
              resolvedPromise,
            );
          }
          delete errors[name];
        }
      });
      if (promises.length) {
        cancelNavigation();
        Promise.all(promises).then(() => {
          navigateToUrl(newUrl);
        });
      }
    },
  );
}

export * from 'single-spa';

function getApplicationElement(name: string) {
  return document.getElementById(`single-spa-application:${name}`);
}

function strToLocation(str: string): any {
  try {
    return new URL(str);
  } catch (err) {
    // IE11
    const a = document.createElement('a');
    a.href = str;
    return a;
  }
}

function getAppsToUnmount(newUrl: string | undefined) {
  const appsToUnmount: string[] = [];
  const appsThatShouldBeActive = checkActivityFunctions(
    newUrl ? strToLocation(newUrl) : location,
  );

  getAppNames().forEach((app) => {
    if (appsThatShouldBeActive.indexOf(app) < 0) {
      appsToUnmount.push(app);
    }
  });

  return appsToUnmount;
}

function getStorageKey(app: string) {
  return `${app}MFAppMD5`;
}

async function importApp(appName: string, app: MFApp, module: string) {
  const appNS: any = getMFAppVar(appName);
  let container: any = window[appNS];
  if (!container) {
    let entry = `${app.app}/${getMFAppEntry(appName)}`;
    if (app.cache === false) {
      const manifest = `${app.app}/${app.manifestFileName || defaultManifestFileName}`;
      const response = await fetch(manifest, {
        method: 'get',
        mode: 'cors',
        cache: 'no-cache'
      });
      const content = await response.text();
      const contentMd5 = md5(content);
      const key = getStorageKey(appName);
      const current = localStorage.getItem(key);
      if (current !== contentMd5) {
        localStorage.setItem(key, contentMd5);
      }
      entry += '?' + contentMd5;
    }
    await loadScript(entry, appNS);
  }
  container = window[appNS];
  // @ts-ignore
  await __webpack_init_sharing__('default');
  // @ts-ignore
  await container.init(__webpack_share_scopes__.default);
  const Module = await container.get(module);
  const m = Module();
  return m;
}

const dataKey = 'data-mf-app';

function loadScript(url: string, ns: string) {
  return new Promise((resolve, reject) => {
    let script: HTMLScriptElement | undefined;
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const s = scripts[i];
      if (s.getAttribute('src') == url || s.getAttribute(dataKey) == ns) {
        script = s;
        break;
      }
    }
    let needAttach;
    if (!script) {
      needAttach = true;
      script = document.createElement('script');
      script.setAttribute(dataKey, ns);
      script.charset = 'utf-8';
      script.src = url;
    }
    if (script) {
      const onScriptComplete = function (
        prev: ((e: Event) => void) | undefined,
        event: Event,
      ) {
        if (script) {
          // avoid mem leaks in IE.
          script.onload = null;
          script.onerror = null;
          clearTimeout(timeout);
          script.parentNode && script.parentNode.removeChild(script);
          if (['timeout', 'error'].includes(event.type)) {
            reject(event);
          } else {
            resolve(event);
          }
          prev && prev(event);
        }
      };
      const timeout = setTimeout(() => {
        onScriptComplete(undefined, {
          type: 'timeout',
          target: script,
        } as any);
      }, 120000);
      // @ts-ignore
      script.onerror = onScriptComplete.bind(null, script.onerror);
      // @ts-ignore
      script.onload = onScriptComplete.bind(null, script.onload);
      needAttach && document.head.appendChild(script);
    }
  });
}
