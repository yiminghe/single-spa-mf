import React from 'react';
import { Button } from '../Button';

export default ({gotoHome}:any)=>(<>
  <div>app1 intro</div>
  <Button onClick={gotoHome}>goto app1 home</Button>
</>);
