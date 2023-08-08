declare let __webpack_public_path__: string;

export let publicPath = __webpack_public_path__;

publicPath = new URL(publicPath).pathname;
