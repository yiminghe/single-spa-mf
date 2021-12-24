## single-spa-mf

combine single-spa with module federation

[![NPM version](https://badge.fury.io/js/single-spa-mf.png)](http://badge.fury.io/js/single-spa-mf)
[![NPM downloads](http://img.shields.io/npm/dm/single-spa-mf.svg)](https://npmjs.org/package/single-spa-mf)


### API

```ts
import { LifeCycles } from 'single-spa';
import * as webpack from './webpack';
export { webpack };
export interface MFAppHandle {
    mount: (el: HTMLElement) => Promise<void> | void;
    unmount: (el: HTMLElement) => Promise<void> | void;
}
export interface MFApp {
    activeFn: (location: Location) => boolean;
    /** main app module */
    main?: () => Promise<LifeCycles<any>>;
    /** app public url */
    app?: string;
    customProps?: any;
    loader?: MFAppHandle;
    error?: MFAppHandle;
    /** whether check manifest to update, default do not check manifest: cache true */
    cache?: boolean;
    /** defaults to manifest.json */
    manifestFileName?: string;
}
export declare type MFApps = Record<string, MFApp>;
export declare function initMFApps(apps: MFApps): void;
export * from 'single-spa';

```

### demo

https://github.com/yiminghe/single-spa-mf
