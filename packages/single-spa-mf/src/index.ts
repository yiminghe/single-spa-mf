import {
  addErrorHandler,
  checkActivityFunctions,
  getAppNames,
  registerApplication,
  navigateToUrl,
  LifeCycles,
} from 'single-spa';
import { getMFAppEntry, getMFAppVar, mainModule } from './utils';
import * as webpack from './webpack';
import { chooseDomElementGetter } from 'dom-element-getter-helpers';

export { webpack };

const resolvedPromise = Promise.resolve();

/**
 *@public
 */
export interface MFAppHandle {
  mount: (el: HTMLElement) => Promise<void> | void;
  unmount: (el: HTMLElement) => Promise<void> | void;
}

export type SingleSpaConfig = Parameters<typeof registerApplication>[0];

export type AsyncFunction = (app: MFApp) => Promise<void> | void;

/**
 *@public
 */
export interface MFApp {
  name: string;
  activeWhen: SingleSpaConfig['activeWhen'];
  /** main app module */
  app?: (e: { name: string }) => Promise<LifeCycles<any>>;
  /** app entry url */
  entry?: (e: { name: string; entryName: string }) => string | Promise<string>;
  customProps?: SingleSpaConfig['customProps'];
  loader?: MFAppHandle;
  error?: MFAppHandle;
  beforeLoad?: AsyncFunction;
  afterLoad?: AsyncFunction;
}

type MFApps = Record<string, MFApp>;

const apps: MFApps = {};

async function load<T>(
  fn: (e: { name: string }) => Promise<T>,
  appName: string,
): Promise<T> {
  const app = apps[appName];
  if (!app) {
    throw new Error(`App:${appName} not found!`);
  }
  const applicationElement = getApplicationElement(app)!;
  let showed: Promise<void> | undefined;
  const loadingTimeout = setTimeout(() => {
    if (app?.loader) {
      showed = app.loader.mount(applicationElement) || resolvedPromise;
    }
  }, 100);
  try {
    const ret = await fn({ name: appName });
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

async function loadApp(app: MFApp) {
  return load(() => importApp(app, mainModule), app.name);
}

function registerApp(app: MFApp) {
  if (app.entry) {
    registerApplication({
      name: app.name,
      activeWhen: app.activeWhen,
      customProps: app.customProps || {},
      app: () => loadApp(app),
    });
  } else if (app.app) {
    registerApplication({
      name: app.name,
      activeWhen: app.activeWhen,
      customProps: app.customProps || {},
      app: () => load(app.app!, app.name),
    });
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
  const appName = err.appOrParcelName;
  const app = apps[appName];
  if (app) {
    const applicationElement = getApplicationElement(app)!;
    if (app.error) {
      const mountPromise =
        app.error.mount(applicationElement) || resolvedPromise;
      errors[appName] = { applicationElement, mountPromise };
    }
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

/**
 *@public
 */
export function registerMFApplications(appArray: MFApp[]) {
  for (const app of appArray) {
    const appName = app.name;
    if (apps[appName]) {
      throw new Error(`App:${appName} already registered!`);
    }
    apps[appName] = app;
    registerApp(app);
  }
}

export * from 'single-spa';

function getApplicationElement(app: MFApp) {
  return chooseDomElementGetter({}, {
    ...app.customProps,
    name: app.name,
  } as any)();
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

async function importApp(app: MFApp, module: string) {
  if (app.beforeLoad) {
    await app.beforeLoad(app);
  }
  const appName = app.name;
  const appNS: any = getMFAppVar(appName);
  let container: any = window[appNS];
  if (!container) {
    let entry = app.entry!({
      entryName: `${getMFAppEntry(appName)}`,
      name: appName,
    });
    if (typeof entry !== 'string') {
      entry = await entry;
    }
    await loadScript(entry, appNS);
  }
  container = window[appNS];
  // @ts-ignore
  await __webpack_init_sharing__('default');
  // @ts-ignore
  await container.init(__webpack_share_scopes__.default);
  const Module = await container.get(module);
  if (app.afterLoad) {
    await app.afterLoad(app);
  }
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
      if (s.getAttribute('src') === url || s.getAttribute(dataKey) === ns) {
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
          script.parentNode?.removeChild(script);
          if (['timeout', 'error'].includes(event.type)) {
            reject(event);
          } else {
            resolve(event);
          }
          prev?.(event);
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
