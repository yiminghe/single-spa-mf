import React from 'react';
import { Button } from '../Button';

export default ({gotoIntro,gotoNone,gotoNone2}:any)=>( <>
  <div>app1 home</div>
  <Button onClick={gotoIntro}>goto app1 intro</Button>
  <br />
  <Button onClick={gotoNone}>goto none</Button>
  <br />
  <Button onClick={gotoNone2}>goto home none</Button>
</>);
