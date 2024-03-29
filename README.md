# single-spa-mf

A micro frontend solution based on single-spa and module federation

[![NPM version](https://badge.fury.io/js/single-spa-mf.png)](http://badge.fury.io/js/single-spa-mf)
[![NPM downloads](http://img.shields.io/npm/dm/single-spa-mf.svg)](https://npmjs.org/package/single-spa-mf)
![Build Status](https://github.com/yiminghe/single-spa-mf/actions/workflows/ci.yaml/badge.svg)
[![single-spa-mf](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/neygmi/main&style=flat&logo=cypress)](https://cloud.cypress.io/projects/neygmi/runs)

```
npm install single-spa-mf
```


## API Report File for "single-spa-mf"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { LifeCycles } from 'single-spa';
import { registerApplication } from 'single-spa';

// @public (undocumented)
export type AsyncFunction = (app: MFApp) => Promise<void> | void;

// @public (undocumented)
const getMFAppConfig: ({ app }: {
    app: string;
}) => {
    name: string;
    filename: string;
};

// @public (undocumented)
const getMFExposes: (mod: string) => {
    Single_SPA_MF_main: string;
};

// @public (undocumented)
export interface MFApp {
    // (undocumented)
    activeWhen: SingleSpaConfig['activeWhen'];
    // (undocumented)
    afterLoad?: AsyncFunction;
    app?: (e: {
        name: string;
    }) => Promise<LifeCycles<any>>;
    // (undocumented)
    beforeLoad?: AsyncFunction;
    // (undocumented)
    customProps?: SingleSpaConfig['customProps'];
    entry?: (e: {
        name: string;
        entryName: string;
    }) => string | Promise<string>;
    // (undocumented)
    error?: MFAppHandle;
    // (undocumented)
    loader?: MFAppHandle;
    // (undocumented)
    name: string;
}

// @public (undocumented)
export interface MFAppHandle {
    // (undocumented)
    mount: (el: HTMLElement) => Promise<void> | void;
    // (undocumented)
    unmount: (el: HTMLElement) => Promise<void> | void;
}

// @public (undocumented)
export function registerMFApplications(appArray: MFApp[]): void;

// @public (undocumented)
export type SingleSpaConfig = Parameters<typeof registerApplication>[0];

declare namespace webpack {
    export {
        getMFAppConfig,
        getMFExposes
    }
}
export { webpack }


export * from "single-spa";

// (No @packageDocumentation comment for this package)

```
## demo

react + react-router + tailwindcss + single-spa + module federation + pnpm8

```
nvm install 18.17.0
corepack enable
pnpm i
pnpm start
```

main app: http://localhost:3001/

app1: http://localhost:3002/