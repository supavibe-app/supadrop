const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const assetPrefix = process.env.ASSET_PREFIX || '';

const plugins = [
  [
    withLess,
    {
      lessLoaderOptions: {
        lessOptions: {
          modifyVars: {
            '@primary-color': '#CCFF00',
            '@text-color': 'rgba(255, 255, 255)',
            '@assetPrefix': assetPrefix || "''",
          },
          javascriptEnabled: true,
        },
      },
    },
  ],
];

module.exports = withPlugins(plugins, {
  assetPrefix,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_STORE_OWNER_ADDRESS:
      process.env.STORE_OWNER_ADDRESS ||
      process.env.REACT_APP_STORE_OWNER_ADDRESS_ADDRESS,
    NEXT_PUBLIC_STORE_ADDRESS: process.env.STORE_ADDRESS,
    NEXT_PUBLIC_BIG_STORE: process.env.REACT_APP_BIG_STORE,
    NEXT_PUBLIC_CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
    NEXT_PUBLIC_ENDPOINT: process.env.REACT_APP_ENDPOINT,
    NEXT_PUBLIC_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_BASE_STORAGE_URL: process.env.REACT_APP_BASE_STORAGE_URL,
    NEXT_PUBLIC_URL_UPLOAD_NFT: process.env.REACT_APP_URL_UPLOAD_NFT
  },
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/apply',
        destination: 'https://forms.gle/Wxotbnjj9j5mPdBaA',
        permanent: false,
        basePath: false
      },
    ]
  }
});
