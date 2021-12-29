import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { registerMFApplications, start } from 'single-spa-mf';
import { publicPath } from 'common';

const customProps = {
  publicPath,
};

registerMFApplications([{
  app: () => import('./main/Main'),
  activeWhen: () => true,
  customProps,
  name: 'app1',
}]);

ReactDOM.render(<App />, document.getElementById('root'));

start();
