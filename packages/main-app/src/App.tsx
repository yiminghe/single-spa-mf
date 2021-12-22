import React, { useCallback } from 'react';
import { navigateToUrl } from 'single-spa';
import { publicPath } from './utils';
import { Button } from './Button';

const App = () => {
  const onClick = useCallback((e) => {
    const to = e.target.dataset.href;
    if (location.pathname !== to) {
      console.log('push to', to);
      navigateToUrl(to);
    }
  }, []);

  return (
    <>
      <h1>main app</h1>
      <div>
        <Button onClick={onClick} data-href={publicPath + ''}>
          home
        </Button>{' '}
        &nbsp;
        <Button onClick={onClick} data-href={publicPath + 'intro'}>
          intro
        </Button>{' '}
        &nbsp;
        <Button onClick={onClick} data-href={publicPath + 'app2'}>
          app2
        </Button>{' '}
        &nbsp;
        <Button onClick={onClick} data-href={publicPath + 'app1'}>
          app1
        </Button>
      </div>
      <div>
        <div id="loading">
          <div className="spinner">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
          </div>
        </div>
        <div id="single-spa-application:home"></div>
        <div id="single-spa-application:app1"></div>
        <div id="single-spa-application:app2"></div>
      </div>
    </>
  );
};

export default () => {
  return <App />;
};
