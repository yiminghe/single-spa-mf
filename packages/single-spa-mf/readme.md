## single-spa-mf

combine single-spa with module federation

[![NPM version](https://badge.fury.io/js/single-spa-mf.png)](http://badge.fury.io/js/single-spa-mf)
[![NPM downloads](http://img.shields.io/npm/dm/single-spa-mf.svg)](https://npmjs.org/package/single-spa-mf)


### API

```ts
import { registerApplication, LifeCycles } from 'single-spa';
import * as webpack from './webpack';
export { webpack };
export interface MFAppHandle {
    mount: (el: HTMLElement) => Promise<void> | void;
    unmount: (el: HTMLElement) => Promise<void> | void;
}
declare type SingleSpaConfig = Parameters<typeof registerApplication>[0];
export interface MFApp {
    activeWhen: SingleSpaConfig['activeWhen'];
    /** main app module */
    app?: (e: {
        name: string;
    }) => Promise<LifeCycles<any>>;
    /** app entry url */
    entry?: (e: {
        name: string;
        entryName: string;
    }) => string | Promise<string>;
    customProps?: SingleSpaConfig['customProps'];
    loader?: MFAppHandle;
    error?: MFAppHandle;
}
export declare type MFApps = Record<string, MFApp>;
export declare function initMFApps(apps: MFApps): void;
export * from 'single-spa';

```

### demo

https://github.com/yiminghe/single-spa-mf

