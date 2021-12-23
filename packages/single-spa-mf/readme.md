## single-spa-mf

combine single-spa with module federation

[![NPM version](https://badge.fury.io/js/single-spa-mf.png)](http://badge.fury.io/js/single-spa-mf)
[![NPM downloads](http://img.shields.io/npm/dm/single-spa-mf.svg)](https://npmjs.org/package/single-spa-mf)


### API

```ts
import { LifeCycles, start } from 'single-spa';
export declare function getLoader(handles?: AppHandles): {
    registerApplication: (app: string, path: string, check: (l: Location) => boolean, customProps: any) => void;
    registerMainApplication: (app: string, loader: () => Promise<LifeCycles<any>>, check: (l: Location) => boolean, customProps: any) => void;
    start: typeof start;
};
interface AppHandle {
    mount: (el: HTMLElement) => Promise<void>;
    unmount: (el: HTMLElement) => Promise<void>;
}
declare type AppHandles = Record<string, AppHandle>;
export declare function addErrorAppHandles(handles?: AppHandles): void;

### demo

https://github.com/yiminghe/micro-frontend-demo

