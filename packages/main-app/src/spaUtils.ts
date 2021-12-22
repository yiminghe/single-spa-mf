import {
  addErrorHandler,
  checkActivityFunctions,
  getAppNames,
} from 'single-spa';

// @ts-ignore
export let publicPath = __webpack_public_path__;

publicPath = new URL(publicPath).pathname;

export function getLoader(handles: AppHandles) {
  async function load<T>(fn: () => Promise<T>, id: string): Promise<T> {
    const applicationElement = getApplicationElement(id)!;
    const handle = handles[id];
    let showed = false;
    let loadingTimeout = setTimeout(() => {
      showed = true;
      if (handle) {
        handle.mount(applicationElement);
      }
    }, 100);
    try {
      const ret = await fn();
      if (showed) {
        if (handle) {
          handle.unmount(applicationElement);
        }
      }
      return ret;
    } finally {
      clearTimeout(loadingTimeout);
    }
  }

  async function loadApp(entry: string, module: string = 'main') {
    const app: any = entry.match(/\/(\w+)Entry\.js$/)![1];
    return load(() => importApp(app, entry, module), app);
  }

  return {
    load,
    loadApp,
  };
}

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

interface AppHandle {
  mount: (el: HTMLElement) => Promise<void>;
  unmount: (el: HTMLElement) => Promise<void>;
}

type AppHandles = Record<string, AppHandle>;

export function addErrorAppHandles(handles: AppHandles) {
  const errors: Record<string, HTMLElement> = {};

  addErrorHandler((err) => {
    const id = err.appOrParcelName;
    const applicationElement = getApplicationElement(id)!;
    const handle = handles[id];
    if (handle) {
      handle.mount(applicationElement);
      errors[id] = applicationElement;
    }
  });

  window.addEventListener(
    'single-spa:before-routing-event',
    ({ detail: { newUrl } }: any) => {
      getAppsToUnmount(newUrl).forEach((name) => {
        if (errors[name]) {
          const handle = handles[name];
          if (handle) {
            handle.unmount(errors[name]);
          }
          delete errors[name];
        }
      });
    },
  );
}

async function importApp(app: string, entry: string, module: string) {
  const appNS: any = app + 'App';
  let container: any = window[appNS];
  if (!container) {
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
