import React, { useCallback } from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

const App2Home = ({ publicPath, singleSpa }) => {
  const gotoIntro = useCallback(() => {
    singleSpa.navigateToUrl(publicPath + 'app2/intro');
  }, []);

  const gotoHome = useCallback(() => {
    singleSpa.navigateToUrl(publicPath + 'app2');
  }, []);

  return (
    <div>
      <BrowserRouter>
        <div>
          <Routes>
            <Route
              path={publicPath + 'app2'}
              element={
                <>
                  <div>app2 home</div>
                  <button onClick={gotoIntro}>goto app2 intro</button>
                </>
              }
            />
            <Route
              path={publicPath + 'app2/intro'}
              element={
                <>
                  <div>app2 intro</div>
                  <button onClick={gotoHome}>goto app2 home</button>
                </>
              }
            />
            <Route
              path="*"
              element={<Navigate to={publicPath + 'app2'} replace />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App2Home;

const App2Spa = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App2Home,
});

export const bootstrap = App2Spa.bootstrap;
export const mount = App2Spa.mount;
export const unmount = App2Spa.unmount;
