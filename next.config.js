// @ts-check
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
  webpack: (config) => {
    config.module.exprContextCritical = false;
    return config;
  },
};

module.exports = withVanillaExtract(nextConfig);
