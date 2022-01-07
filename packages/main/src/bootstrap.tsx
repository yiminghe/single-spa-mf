import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { registerMFApplications, MFApp, start } from 'single-spa-mf';
import { publicPath } from 'common';
// @ts-ignore
import md5 from 'blueimp-md5';

ReactDOM.render(<App />, document.getElementById('root'));

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

const appNames: [string, number][] = [
  ['app1', 3002],
  ['notFound', 3004],
];

function getActiveFn(app: string) {
  return (location: Location) => {
    return location.pathname.startsWith(publicPath + app);
  };
}

const appContent = document.getElementById('app-content');
const customProps = {
  publicPath,
  domElementGetter(props: { name: string }) {
    const { name } = props;
    const id = `single-spa-application:${name}`;
    let el = document.getElementById(id);
    if (el) {
      return el;
    }
    el = document.createElement('div');
    el.id = id;
    appContent?.appendChild(el);
    return el;
  },
};

function getMFAppMD5Key(app: string) {
  return `${app}_MD5.js`;
}

const apps: MFApp[] = appNames.map(([name, port]) => ({
  name,
  entry: async ({ entryName }: { entryName: string }) => {
    const path = `http://localhost:${port}`;
    let entry = `${path}/${entryName}`;
    const manifest = `${path}/manifest.json`;
    const response = await fetch(manifest, {
      method: 'get',
      mode: 'cors',
      cache: 'no-cache',
    });
    const content = await response.text();
    const contentMd5 = md5(content);
    const key = getMFAppMD5Key(name);
    const current = localStorage.getItem(key);
    if (current !== contentMd5) {
      localStorage.setItem(key, contentMd5);
    }
    entry += '?' + contentMd5;
    return entry;
  },
  activeWhen: getActiveFn(name),
  loader,
  error,
  customProps,
}));

function notApp(location: Location) {
  for (const app of apps) {
    if (
      app.entry &&
      typeof app.activeWhen === 'function' &&
      app.activeWhen(location)
    ) {
      return false;
    }
  }
  return true;
}

apps.push({
  name: mainAppName,
  activeWhen: notApp,
  app: () => import('./main/Main'),
  loader,
  error,
  customProps,
});

registerMFApplications(apps);

const times: Record<string, { start: number; end: number; d: number }> = {};

window.addEventListener('single-spa:before-mount-routing-event', (e: any) => {
  const status = e.detail.newAppStatuses;
  const keys = Object.keys(status);
  for (const k of keys) {
    if (status[k] === 'MOUNTED' && !reported[k]) {
      times[k] = {
        start: Date.now(),
        end: 0,
        d: 0,
      };
    }
  }
});

let reported: Record<string, boolean> = {};
window.addEventListener('single-spa:app-change', (e: any) => {
  const status = e.detail.newAppStatuses;
  const keys = Object.keys(status);
  for (const k of keys) {
    if (status[k] === 'MOUNTED' && !reported[k]) {
      times[k] = {
        ...times[k],
        end: Date.now(),
        d: Date.now() - times[k].start,
      };
      console.log(`${k} first mount time:`, times[k].d);
      reported[k] = true;
    }
  }
});
start();
