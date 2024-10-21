/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  // Preserve your existing transformer configuration for SVGs
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
  };

  // Update the resolver configuration
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],

    // Add the resolveRequest function to map 'crypto' to 'react-native-quick-crypto'
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'crypto') {
        // When importing 'crypto', resolve to 'react-native-quick-crypto'
        return context.resolveRequest(
          context,
          'react-native-quick-crypto',
          platform,
        );
      }
      // Use the standard Metro resolver for all other modules
      return resolver.resolveRequest
        ? resolver.resolveRequest(context, moduleName, platform)
        : context.resolveRequest(context, moduleName, platform);
    },
  };

  return config;
})();