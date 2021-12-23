import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { publicPath } from 'common';
import { getLoader } from 'single-spa-mf';

const customProps = {
  publicPath,
};

const { registerMainApplication, start } = getLoader();

registerMainApplication(
  'app2',
  () => import('./App2Page'),
  () => true,
  customProps,
);

ReactDOM.render(<App />, document.getElementById('root'));

start();
