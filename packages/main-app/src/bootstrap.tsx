import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { registerApplication, start } from 'single-spa';
import { publicPath, importApp } from './utils';

ReactDOM.render(<App />, document.getElementById('root'));

const loading = document.getElementById('loading');

async function load(fn) {
  let finish = false;
  setTimeout(() => {
    if (!finish) {
      loading.style.display = 'block';
    }
  }, 100);
  const ret = await fn();
  finish = true;
  loading.style.display = 'none';
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
  () => load(() => import('./Home')),
  (location) => {
    return !isApp1(location) && !isApp2(location);
  },
  customProps,
);

registerApplication(
  'app1',
  () => load(() => importApp('http://localhost:3002/app1Entry.js')),
  isApp1,
  customProps,
);

registerApplication(
  'app2',
  () => load(() => importApp('http://localhost:3003/app2Entry.js')),
  isApp2,
  customProps,
);

start();
