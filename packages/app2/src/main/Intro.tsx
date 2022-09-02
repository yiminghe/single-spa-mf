import React from 'react';
import { Button } from '../Button';

export default ({ gotoHome }: any) => (
  <>
    <div>app2 intro</div>
    <Button onClick={gotoHome} data-btn="app2-intro-home">
      goto app2 home
    </Button>
  </>
);
