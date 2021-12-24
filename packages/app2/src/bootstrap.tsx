import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initMFApps,start } from 'single-spa-mf';
import { publicPath } from 'common';

const customProps = {
  publicPath,
};

initMFApps({
  'app2':{
    main:() => import('./App2Page'),
    activeFn:() => true,
    customProps,
  }
});

ReactDOM.render(<App />, document.getElementById('root'));

start();
