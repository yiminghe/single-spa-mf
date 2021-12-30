import React from 'react';
import { Button } from '../Button';

export default ({gotoIntro,gotoNone,gotoNone2}:any)=>( <>
  <div>app1 home</div>
  <Button onClick={gotoIntro} className="app1-home-intro">goto app1 intro</Button>
  <br />
  <Button onClick={gotoNone} className="app1-home-none">goto none</Button>
  <br />
  <Button onClick={gotoNone2} className="home-none">goto home none</Button>
</>);
