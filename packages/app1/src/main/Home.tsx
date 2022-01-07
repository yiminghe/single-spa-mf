import React from 'react';
import { Button } from '../Button';

export default ({ gotoIntro, gotoNone, gotoNone2 }: any) => (
  <>
    <div>app1 home</div>
    <Button onClick={gotoIntro} data-btn="app1-home-intro">
      goto app1 intro
    </Button>

    <Button onClick={gotoNone} data-btn="app1-home-none">
      goto none
    </Button>

    <Button onClick={gotoNone2} data-btn="home-none">
      goto home none
    </Button>
  </>
);
