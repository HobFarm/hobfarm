import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import { departments, departmentStatus } from "./src/data/departments.ts";
import { academyCourseManifests } from "./src/data/academy-manifest.ts";
import { PUBLIC_GRIMOIRE_ARCHIVE_ENABLED } from "./src/data/public-features.ts";

const noindexDepartmentPaths = new Set(
  departments
    .filter((department) => departmentStatus(department) !== "active")
    .map((department) => `/departments/${department.slug}/`),
);
const redirectedPaths = new Set([
  "/gallery/before-and-after/",
  "/gallery/cute-corrupted/",
  "/departments/workshop-notes/",
]);
const privatePrototypePaths = new Set(["/workshop/visual-lab/", "/workshop/stylefusion/prototype/"]);
const privateTransactionPaths = new Set([
  "/academy/checkout/complete/",
  "/membership/success/",
  "/shop/order-received/",
]);
const noindexAcademyPaths = new Set([
  "/academy/choose-the-tool-for-the-job/",
  "/academy/production-system-sprint/",
]);
for (const course of academyCourseManifests) {
  const coursePath = `/academy/courses/${course.slug}/`;
  if (course.status !== "available") noindexAcademyPaths.add(coursePath);
  for (const lesson of course.lessons) {
    if (course.status !== "available" || lesson.legacyHref) {
      noindexAcademyPaths.add(`${coursePath}${lesson.slug}/`);
    }
  }
}

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
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return (
          !page.includes("/login") &&
          !page.includes("/account") &&
          !pathname.startsWith("/articles/tags/") &&
          (PUBLIC_GRIMOIRE_ARCHIVE_ENABLED ||
            pathname === "/grimoire/" ||
            !pathname.startsWith("/grimoire/")) &&
          !privatePrototypePaths.has(pathname) &&
          !privateTransactionPaths.has(pathname) &&
          !noindexAcademyPaths.has(pathname) &&
          !noindexDepartmentPaths.has(pathname) &&
          !redirectedPaths.has(pathname)
        );
      },
    }),
    mdx({ gfm: true }),
    react(),
  ],
});
