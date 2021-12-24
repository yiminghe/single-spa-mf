import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initMFApps, MFApps, start } from 'single-spa-mf';
import { publicPath } from 'common';
// @ts-ignore
import md5 from 'blueimp-md5';

const mainAppName = 'main';

const loadingHtml = `
<div id="loading">
  <div class="spinner">
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
  </div>
</div>
`;

const loader = {
  mount(el: HTMLElement) {
    el.innerHTML = loadingHtml;
  },
  unmount(el: HTMLElement) {
    el.innerHTML = '';
  },
};

const error = {
  mount(el: HTMLElement) {
    el.innerHTML = 'error when loading';
  },
  unmount(el: HTMLElement) {
    el.innerHTML = '';
  },
};

const appNames: ([string, number])[] = [['app1', 3002], ['app2', 3003], ['notFound', 3004]];

function getActiveFn(app: string) {
  return (location: Location) => {
    return location.pathname.startsWith(publicPath + app);
  };
}

const customProps = {
  publicPath,
};

function getMFAppMD5Key(app: string) {
  return `${app}_MD5.js`;
}

const apps: MFApps = appNames.reduce(
  (ret, c) => ({
    ...ret,
    [c[0]]: {
      entry: async ({ entryName }: { entryName: string }) => {
        const path = `http://localhost:${c[1]}`;
        let entry = `${path}/${entryName}`;
        const manifest = `${path}/manifest.json`;
        const response = await fetch(manifest, {
          method: 'get',
          mode: 'cors',
          cache: 'no-cache'
        });
        const content = await response.text();
        const contentMd5 = md5(content);
        const key = getMFAppMD5Key(c[0]);
        const current = localStorage.getItem(key);
        if (current !== contentMd5) {
          localStorage.setItem(key, contentMd5);
        }
        entry += '?' + contentMd5;
        return entry;
      },
      activeWhen: getActiveFn(c[0]),
      loader,
      error,
      customProps,
    },
  }),
  {},
);

function notApp(location: Location) {
  for (const m of Object.keys(apps)) {
    const app = apps[m];
    if (app.entry && typeof app.activeWhen==='function' &&app.activeWhen(location)) {
      return false;
    }
  }
  return true;
}

apps[mainAppName] = {
  activeWhen: notApp,
  app: () => import('./Main'),
  loader,
  error,
  customProps,
};

initMFApps(apps);

ReactDOM.render(<App />, document.getElementById('root'));

start();
