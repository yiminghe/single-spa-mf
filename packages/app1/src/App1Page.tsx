import React, { useCallback } from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Button } from './Button';

const App1Home = ({ publicPath, singleSpa }:any) => {
  const gotoIntro = useCallback(() => {
    singleSpa.navigateToUrl(publicPath + 'app1/intro');
  }, []);

  const gotoHome = useCallback(() => {
    singleSpa.navigateToUrl(publicPath + 'app1');
  }, []);

  const gotoNone = useCallback(() => {
    singleSpa.navigateToUrl(publicPath + 'app1/x');
  }, []);

  const gotoNone2 = useCallback(() => {
    singleSpa.navigateToUrl(publicPath + 'x');
  }, []);

  return (
    <div>
      <BrowserRouter>
        <div>
          <Routes>
            <Route
              path={publicPath + 'app1'}
              element={
                <>
                  <div>app1 home</div>
                  <Button onClick={gotoIntro}>goto app1 intro</Button>
                  <br />
                  <Button onClick={gotoNone}>goto none</Button>
                  <br />
                  <Button onClick={gotoNone2}>goto home none</Button>
                </>
              }
            />
            <Route
              path={publicPath + 'app1/intro'}
              element={
                <>
                  <div>app1 intro</div>
                  <Button onClick={gotoHome}>goto app1 home</Button>
                </>
              }
            />
            <Route
              path="*"
              element={<Navigate to={publicPath + 'app1'} replace />}
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
