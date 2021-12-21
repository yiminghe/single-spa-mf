import React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { publicPath } from './utils';

const Home = () => {
  return <BrowserRouter><div>
      <Routes>
        <Route path={publicPath + ''} element={<div>home</div>}/>
        <Route path={publicPath + "intro"} element={<div>intro</div>}/>
        <Route path="*" element={<Navigate to={publicPath+''} replace />} />
      </Routes>
  </div></BrowserRouter>
};

export default Home;

const HomeSpa = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Home
});

export const bootstrap = HomeSpa.bootstrap;
export const mount = HomeSpa.mount;
export const unmount = HomeSpa.unmount;