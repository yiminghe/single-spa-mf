import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { registerApplication, start } from 'single-spa';
import { publicPath, importApp } from './utils';

ReactDOM.render(<App />, document.getElementById('root'));

const loading = document.getElementById('loading');

let loadingTimeout;

async function load(fn, tag) {
  //console.log('start', tag);
  let showed = false;
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
  }
  loadingTimeout = setTimeout(() => {
    showed = true;
    loading.style.display = 'block';
  }, 100);
  let localTimeout = loadingTimeout;
  const ret = await fn();
  if (loadingTimeout === localTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
    if (showed) {
      loading.style.display = 'none';
    }
  }
  //console.log('end', tag);
  return ret;
}

const customProps = {
  publicPath,
};

function isApp1(location) {
  return location.pathname.startsWith(publicPath + 'app1');
}

function isApp2(location) {
  return location.pathname.startsWith(publicPath + 'app2');
}

registerApplication(
  'home',
  () => load(() => import('./Home'), 'home'),
  (location) => {
    return !isApp1(location) && !isApp2(location);
  },
  customProps,
);

registerApplication(
  'app1',
  () => load(() => importApp('http://localhost:3002/app1Entry.js'), 'app1'),
  isApp1,
  customProps,
);

registerApplication(
  'app2',
  () => load(() => importApp('http://localhost:3003/app2Entry.js'), 'app2'),
  isApp2,
  customProps,
);

start();
