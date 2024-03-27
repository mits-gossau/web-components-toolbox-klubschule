module.exports = {
  staticDirs: [{
    from: '../src',
    to: '/src'
  }],
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@etchteam/storybook-addon-css-variables-theme',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
        measure: false,
        outline: false
      }
    },
    'storybook-addon-themes',
    '@storybook/addon-mdx-gfm',
    '@storybook/addon-webpack5-compiler-babel'
  ],
  framework: {
    name: '@storybook/web-components-webpack5',
    options: {}
  },
  docs: {
    autodocs: true
  },
  core: {
    disableTelemetry: true
  },
  webpackFinal: async (config, { configType }) => {
    // Add HTML loader rule
    config.module.rules.push({
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: { minimize: false }
      }],
    });

    return config;
  },
}
