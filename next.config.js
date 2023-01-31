// @ts-check
const webpack = require('webpack');
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const getStaticTypes = require('./getStaticTypes');

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['page.tsx'],
  webpack: (config) => {
    config.module.exprContextCritical = false;
    config.plugins.unshift(
      new webpack.DefinePlugin({
        __COMPOSER_GLOBAL__STATIC_TYPES__: JSON.stringify(getStaticTypes()),
      })
    );
    return config;
  },
};

module.exports = withVanillaExtract(nextConfig);
