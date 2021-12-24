import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initMFApps,start } from 'single-spa-mf';
import { publicPath } from 'common';

const customProps = {
  publicPath,
};

initMFApps({
  'app1':{
    main:() => import('./App1Page'),
    activeFn:() => true,
    customProps,
  }
});

ReactDOM.render(<App />, document.getElementById('root'));

start();