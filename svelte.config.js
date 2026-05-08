import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { blogPreprocessor } from './src/lib/preprocessor/index.js';

const config = {
  preprocess: [
    blogPreprocessor(),
    vitePreprocess()
  ],
  kit: {
    adapter: adapter({
      runtime: 'nodejs22.x' // or 'edge' for edge functions
    })
  }
};

export default config;