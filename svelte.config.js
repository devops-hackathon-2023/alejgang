import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      fallback: '404.html',
    }),
    alias: {
      $components: './src/components',
      $types: './src/types',
      $lib: './src/lib',
      $src: './src',
    },
    paths: {
      base: process.env.APP_BASE ?? '',
    },
  },
};

export default config;
