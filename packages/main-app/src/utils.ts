export let publicPath = __webpack_public_path__;

publicPath = new URL(publicPath).pathname;

console.log('publicPath', publicPath);

export async function importApp(entry: string, module: string = 'main') {
  const appNS = entry.match(/\/(\w+)Entry\.js$/)[1] + 'App';
  let container: any = window[appNS];
  if (!container) {
    await loadScript(entry, appNS);
  }
  container = window[appNS];
  await __webpack_init_sharing__('default');
  await container.init(__webpack_share_scopes__.default);
  const Module = await container.get(module);
  const m = Module();
  return m;
}

const dataKey = 'data-mf-app';

function loadScript(url, ns) {
  return new Promise((resolve, reject) => {
    let script;
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
      script.timeout = 120;
      script.src = url;
    } else {
      // console.log('!!!!------');
    }
    const onScriptComplete = function (prev, event) {
      // avoid mem leaks in IE.
      script.onload = null;
      script.onerror = null;
      clearTimeout(timeout);
      // script.parentNode && script.parentNode.removeChild(script);
      if (['timeout', 'error'].includes(event.type)) {
        reject(event);
      } else {
        resolve(event);
      }
      prev && prev(event);
    };
    const timeout = setTimeout(
      onScriptComplete.bind(null, undefined, {
        type: 'timeout',
        target: script,
      }),
      120000,
    );
    script.onerror = onScriptComplete.bind(null, script.onerror);
    script.onload = onScriptComplete.bind(null, script.onload);
    needAttach && document.head.appendChild(script);
  });
}
