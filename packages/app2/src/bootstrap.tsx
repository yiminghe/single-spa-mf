import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { registerMFApplications, start } from 'single-spa-mf';
import { publicPath } from 'common';
import './bootstrap.css';

const customProps = {
  publicPath,
};

registerMFApplications([
  {
    app: () => import('./main/Main_'),
    activeWhen: () => true,
    customProps,
    name: 'app2',
  },
]);

ReactDOM.render(<App />, document.getElementById('root'));

start();
