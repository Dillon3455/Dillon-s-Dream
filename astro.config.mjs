// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
// Вернули fontProviders в импорт, чтобы он был defined!
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import wikiLinkHastPlugin from './src/lib/wikiLinks.mjs';

// GitHub Pages: site (username.github.io) + base (project subpath)
const basePath = '/Dillon-s-Dream';

// https://astro.build/config
export default defineConfig({
  site: 'https://Dillon3455.github.io',
  // Убрали слэш с конца, чтобы не ломать стили Tailwind v4
  base: basePath,

  markdown: {
    processor: satteri({
      hastPlugins: [wikiLinkHastPlugin({ base: basePath })],
    }),
  },
  integrations: [mdx(), sitemap()],

  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Atkinson',
      cssVariable: '--font-atkinson',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/atkinson-regular.woff'],
            weight: 400,
            style: 'normal',
            display: 'swap',
          },
          {
            src: ['./src/assets/fonts/atkinson-bold.woff'],
            weight: 700,
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
