import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { registerApplication, start } from 'single-spa';
import { getLoader, addErrorAppHandles } from './spaUtils';
import { publicPath } from 'common';

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

const appNames = ['app1', 'app2', 'notFound', mainAppName];

const apps: any = appNames.reduce(
  (ret, c) => ({
    ...ret,
    [c]: {
      check(location: Location) {
        return location.pathname.startsWith(publicPath + c);
      },
      loader,
      error,
    },
  }),
  {},
);

apps.app1.port = 3002;
apps.app2.port = 3003;
apps.notFound.port = 3004;

const { load, loadApp } = getLoader(
  appNames.reduce(
    (ret, c) => ({
      ...ret,
      [c]: apps[c].loader,
    }),
    {},
  ),
);

addErrorAppHandles(
  appNames.reduce(
    (ret, c) => ({
      ...ret,
      [c]: apps[c].error,
    }),
    {},
  ),
);

ReactDOM.render(<App />, document.getElementById('root'));

const customProps = {
  publicPath,
};

function notApp(location: Location) {
  const c: any = apps;
  for (const m of Object.keys(c)) {
    if (m !== mainAppName && c[m].check(location)) {
      return false;
    }
  }
  return true;
}

registerApplication(
  mainAppName,
  () => load(() => import('./Main'), mainAppName),
  notApp,
  customProps,
);

for (const app of appNames) {
  if (app !== mainAppName) {
    const info = apps[app];
    registerApplication(
      app,
      () => loadApp(`http://localhost:${info.port}/${app}Entry.js`),
      info.check,
      customProps,
    );
  }
}

start();
