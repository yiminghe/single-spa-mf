import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initMFApps, MFApps, start } from 'single-spa-mf';
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

const appNames: ([string, number])[] = [['app1', 3002], ['app2', 3003], ['notFound', 3004]];

function getActiveFn(app: string) {
  return (location: Location) => {
    return location.pathname.startsWith(publicPath + app);
  };
}

const customProps = {
  publicPath,
};

const apps: MFApps = appNames.reduce(
  (ret, c) => ({
    ...ret,
    [c[0]]: {
      app: `http://localhost:${c[1]}`,
      activeFn: getActiveFn(c[0]),
      loader,
      error,
      cache:false,
      customProps,
    },
  }),
  {},
);

function notApp(location: Location) {
  for (const m of Object.keys(apps)) {
    const app=apps[m];
    if (!app.main&& app.activeFn(location)) {
      return false;
    }
  }
  return true;
}

apps[mainAppName] = {
  activeFn: notApp,
  main: () => import('./Main'),
  loader,
  error,
  customProps,
};

initMFApps(apps);

ReactDOM.render(<App />, document.getElementById('root'));

start();
