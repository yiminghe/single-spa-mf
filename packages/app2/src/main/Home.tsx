import React from 'react';
import { Button } from '../Button';

export default ({ gotoIntro, gotoNone, gotoNone2 }: any) => (
  <>
    <div className="app-title">app2 home</div>
    <Button onClick={gotoIntro} data-btn="app2-home-intro">
      goto app2 intro
    </Button>

    <Button onClick={gotoNone} data-btn="app2-home-none">
      goto none
    </Button>

    <Button onClick={gotoNone2} data-btn="home-none">
      goto home none
    </Button>
  </>
);
