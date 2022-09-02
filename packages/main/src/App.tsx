import React, { useCallback } from 'react';
import { navigateToUrl } from 'single-spa-mf';
import { publicPath } from 'common';
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
        <Button onClick={onClick} data-href={publicPath + 'intro'}>
          intro
        </Button>{' '}
        <Button onClick={onClick} data-href={publicPath + 'app1'}>
          app1
        </Button>
        <Button onClick={onClick} data-href={publicPath + 'app2'}>
          app2
        </Button>
        <Button onClick={onClick} data-href={publicPath + 'notFound'}>
          notFound
        </Button>
      </div>
      <div id="app-content"></div>
    </>
  );
};

export default App;
