/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

module.exports = (async () => {
  /** @type {import('expo/metro-config').MetroConfig} */
  const config = getDefaultConfig(__dirname);

  // Extract the existing resolver settings
  const {
    resolver: {
      sourceExts, assetExts,
    },
  } = config;

  // Return the combined configuration
  return withNativeWind({
    ...config,
    transformer: {
      ...config.transformer,
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  }, { input: './global.css' });
})();