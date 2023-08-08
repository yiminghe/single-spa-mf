import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import React, { lazy, Suspense, useCallback } from 'react';

const fallback = <div>loading</div>;

const Home = lazy(() => import('./Home'));
const Intro = lazy(() => import('./Intro'));

const App1Home = ({ publicPath, singleSpa }: any) => {
  const gotoIntro = useCallback(() => {
    singleSpa.navigateToUrl(`${publicPath}app1/intro`);
  }, []);

  const gotoHome = useCallback(() => {
    singleSpa.navigateToUrl(`${publicPath}app1`);
  }, []);

  const gotoNone = useCallback(() => {
    singleSpa.navigateToUrl(`${publicPath}app1/x`);
  }, []);

  const gotoNone2 = useCallback(() => {
    singleSpa.navigateToUrl(`${publicPath}x`);
  }, []);

  return (
    <div>
      <BrowserRouter>
        <div>
          <Routes>
            <Route
              path={`${publicPath}app1`}
              element={
                <Suspense fallback={fallback}>
                  <Home
                    gotoIntro={gotoIntro}
                    gotoNone={gotoNone}
                    gotoNone2={gotoNone2}
                  />
                </Suspense>
              }
            />
            <Route
              path={`${publicPath}app1/intro`}
              element={
                <Suspense fallback={fallback}>
                  <Intro gotoHome={gotoHome} />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={<Navigate to={`${publicPath}app1`} replace />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App1Home;

const App1Spa = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App1Home,
});

export const bootstrap = App1Spa.bootstrap;
export const mount = App1Spa.mount;
export const unmount = App1Spa.unmount;
