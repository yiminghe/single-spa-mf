import React from 'react';
import { Button } from '../Button';

export default ({gotoHome}:any)=>(<>
  <div>app1 intro</div>
  <Button onClick={gotoHome} className="app1-intro-home">goto app1 home</Button>
</>);
