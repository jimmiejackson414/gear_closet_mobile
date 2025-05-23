module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin', 'optional-require'],
    env: { production: { plugins: ['transform-remove-console', 'react-native-paper/babel'] } },
  };
};
