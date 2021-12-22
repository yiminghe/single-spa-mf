import React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { publicPath } from './spaUtils';

const Main = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path={publicPath + ''} element={<div>home</div>} />
          <Route path={publicPath + 'intro'} element={<div>intro</div>} />
          <Route path="*" element={<Navigate to={publicPath + ''} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Main;

const MainSpa = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Main,
});

export const bootstrap = MainSpa.bootstrap;
export const mount = MainSpa.mount;
export const unmount = MainSpa.unmount;
