import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { getLoader } from 'single-spa-mf';
import { publicPath } from 'common';

const customProps = {
  publicPath,
};

const { registerMainApplication, start } = getLoader();

registerMainApplication(
  'app1',
  () => import('./App1Page'),
  () => true,
  customProps,
);

ReactDOM.render(<App />, document.getElementById('root'));

start();
