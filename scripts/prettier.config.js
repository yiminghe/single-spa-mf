/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
  useTabs: false,
  bracketSpacing: true,
  bracketSameLine: true,
  printWidth: 80,
  tabWidth: 2,
  trailingComma: 'all',
  semi: true,
  singleQuote: true,
};
