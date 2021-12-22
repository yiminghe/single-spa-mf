import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { registerApplication, start } from 'single-spa';

export let publicPath = __webpack_public_path__;

publicPath = new URL(publicPath).pathname;

const customProps = {
  publicPath,
};

registerApplication(
  'app2',
  () => import('./App2Page'),
  () => true,
  customProps,
);

ReactDOM.render(<App />, document.getElementById('root'));

start();
