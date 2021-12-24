console.log('Load babel config!');

module.exports = (api) => {
  api.cache(false);
  return {
    presets: [
      [require.resolve('@babel/preset-env'), { targets: { node: true } }],
      [require.resolve('@babel/preset-typescript')],
    ],
  };
};
