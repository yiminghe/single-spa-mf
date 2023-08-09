## single-spa-mf

A micro frontend solution based on single-spa and module federation

[![NPM version](https://badge.fury.io/js/single-spa-mf.png)](http://badge.fury.io/js/single-spa-mf)
[![NPM downloads](http://img.shields.io/npm/dm/single-spa-mf.svg)](https://npmjs.org/package/single-spa-mf)
![Build Status](https://github.com/yiminghe/single-spa-mf/actions/workflows/ci.yaml/badge.svg)
[![single-spa-mf](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/neygmi/main&style=flat&logo=cypress)](https://cloud.cypress.io/projects/neygmi/runs)

```
npm install single-spa-mf
```

### API

#### single-spa-mf

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
    name: string;
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
export declare function registerMFApplications(appArray: MFApp[]): void;
export * from 'single-spa';

```

#### single-spa-mf/webpack

```ts
export declare const getMFAppConfig: ({ app }: {
    app: string;
}) => {
    name: string;
    filename: string;
};
export declare const getMFExposes: (mod: string) => {
    [x: string]: string;
};
```

### demo

react + react-router + tailwindcss + single-spa + module federation + yarn3

```
nvm install 18.17.0
corepack enable
pnpm i
pnpm build
pnpm start
```

main app: http://localhost:3001/

app1: http://localhost:3002/