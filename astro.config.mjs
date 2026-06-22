import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: cloudflare({ imageService: "compile" }),
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "three",
        "three/examples/jsm/controls/OrbitControls.js",
        "three/examples/jsm/postprocessing/EffectComposer.js",
        "three/examples/jsm/postprocessing/RenderPass.js",
        "three/examples/jsm/postprocessing/UnrealBloomPass.js",
        "three/examples/jsm/postprocessing/OutputPass.js",
      ],
    },
    server: {
      proxy: {
        '/api/chat': {
          target: 'https://hobbot-worker.damp-violet-bf89.workers.dev',
          changeOrigin: true,
        },
        '/api/subscribe': {
          target: 'https://hobbot-worker.damp-violet-bf89.workers.dev',
          changeOrigin: true,
        },
      },
    },
  },
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "css-variables"
    }
  },
  site: 'https://hob.farm',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/login') && !page.includes('/account'),
    }),
    mdx(),
    react(),
  ],
});
