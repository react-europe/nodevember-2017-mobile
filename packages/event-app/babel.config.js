module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:react-native-dotenv'],
    env: {
      production: {
        plugins: ['transform-remove-console', 'react-native-paper/babel'],
      },
    },
  };
};
