module.exports = function (api) {
  api.cache(false);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      '@babel/plugin-transform-export-namespace-from',
      ['module:react-native-dotenv', {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      }],
      'react-native-worklets/plugin',
    ],
  };
};
