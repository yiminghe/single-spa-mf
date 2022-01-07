import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { publicPath } from 'common';
import React, { lazy, Suspense } from 'react';

const fallback = <div>loading</div>;

const Home = lazy(() => import('./Home'));
const Intro = lazy(() => import('./Intro'));

const Main = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route
            path={publicPath + ''}
            element={
              <Suspense fallback={fallback}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path={publicPath + 'intro'}
            element={
              <Suspense fallback={fallback}>
                <Intro />
              </Suspense>
            }
          />
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
