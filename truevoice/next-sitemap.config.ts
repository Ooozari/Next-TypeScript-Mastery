// next-sitemap.config.ts
import type { IConfig } from "next-sitemap";

const config: IConfig = {
  siteUrl: "https://truevoicehub.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // optional:
  // changefreq: 'daily',
  // priority: 0.7,
  // exclude: ['/secret-page'],
};

export default config;
