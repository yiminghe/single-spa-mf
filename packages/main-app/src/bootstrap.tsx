import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { registerApplication, start } from 'single-spa';
import { publicPath, importApp } from './utils';

const customProps={
  publicPath,
};

function isApp1(location){
return location.pathname.startsWith(publicPath+'app1');
}

function isApp2(location){
  return location.pathname.startsWith(publicPath+'app2');
  }

registerApplication(
  'home',
  () => import('./Home'),
  location => {
    return !isApp1(location) && !isApp2(location);
  },
  customProps
);

registerApplication(
  'app1',
  () => importApp('http://localhost:3002/app1Entry.js'),
  isApp1,
  customProps
  );

  registerApplication(
    'app2',
    () => importApp('http://localhost:3003/app2Entry.js'),
    isApp2,
    customProps
    );

ReactDOM.render(<App />, document.getElementById("root"));

start();