const path = require('path');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
    //"@storybook/preset-create-react-app"
  ],
  "framework": "@storybook/react",
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.resolve.alias = {
      ...config.resolve.alias,
      assets: path.resolve(__dirname, '../src/assets/'),
      themes: path.resolve(__dirname, '../src/themes/'),
      components: path.resolve(__dirname, '../src/components/'),
      utilities: path.resolve(__dirname, '../src/utilities/'),
      stores: path.resolve(__dirname, '../src/stores/'),
      proto: path.resolve(__dirname, '../src/proto/'),
      pages: path.resolve(__dirname, '../src/pages/'),
    };

    // Return the altered config
    return config;
  },
}
