import { chromium, Browser, Page } from 'playwright';
import path from 'path';
import fs from 'fs';
import { URL } from 'url';
import { getDb } from '../db.js';
import { RouteNode, DiscoveredAsset } from '../../shared/types.js';

export interface CrawlResult {
  routes: RouteNode[];
  assets: DiscoveredAsset[];
  domData: Record<string, any>;
  computedStyles: Record<string, any>;
}

export class CrawlerService {
  public static normalizeUrl(rawUrl: string): string {
    let url = rawUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    const parsed = new URL(url);
    // Remove trailing slash if root path for uniformity
    if (parsed.pathname === '/') {
      return parsed.origin;
    }
    return parsed.origin + parsed.pathname.replace(/\/$/, '') + parsed.search + parsed.hash;
  }

  static async crawlProject(
    projectId: string,
    targetUrl: string,
    workspaceDir: string,
    maxPages = 5,
    maxDepth = 2
  ): Promise<CrawlResult> {
    const db = getDb();
    const normalizedTarget = this.normalizeUrl(targetUrl);
    const targetOrigin = new URL(normalizedTarget).origin;

    const visitedUrls = new Set<string>();
    const queue: { url: string; depth: number; parentPath?: string }[] = [
      { url: normalizedTarget, depth: 0 },
    ];

    const routes: RouteNode[] = [];
    const assets: DiscoveredAsset[] = [];
    const domDataMap: Record<string, any> = {};
    const stylesMap: Record<string, any> = {};

    let browser: Browser | null = null;

    try {
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) PixelForge/1.0 Engine',
      });

      const screenshotsDir = path.join(workspaceDir, 'screenshots');
      const extractedDir = path.join(workspaceDir, 'extracted');
      fs.mkdirSync(screenshotsDir, { recursive: true });
      fs.mkdirSync(extractedDir, { recursive: true });

      while (queue.length > 0 && routes.length < maxPages) {
        const current = queue.shift()!;
        if (visitedUrls.has(current.url) || current.depth > maxDepth) continue;
        visitedUrls.add(current.url);

        const pagePath = new URL(current.url).pathname || '/';
        const page = await context.newPage();

        try {
          await page.goto(current.url, { waitUntil: 'networkidle', timeout: 15000 });
        } catch {
          // Fallback if networkidle times out
          try {
            await page.goto(current.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
          } catch (e) {
            console.error(`Failed to navigate to ${current.url}:`, e);
            await page.close();
            continue;
          }
        }

        const title = await page.title();

        // 1. Capture Full-Page Screenshot
        const routeFolder = pagePath === '/' ? 'home' : pagePath.replace(/[^a-zA-Z0-9]/g, '_');
        const routeScreenshotDir = path.join(screenshotsDir, routeFolder, 'desktop');
        fs.mkdirSync(routeScreenshotDir, { recursive: true });
        const screenshotPath = path.join(routeScreenshotDir, 'fullpage.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // 2. Extract DOM & Computed Styles + Asset Inspection
        const pageExtraction = await page.evaluate(() => {
          const links: string[] = [];
          document.querySelectorAll('a[href]').forEach((a) => {
            const href = a.getAttribute('href');
            if (href) links.push(href);
          });

          const imgs: { src: string; alt?: string; width?: number; height?: number }[] = [];
          document.querySelectorAll('img').forEach((img) => {
            if (img.src) {
              imgs.push({
                src: img.src,
                alt: img.alt,
                width: img.clientWidth,
                height: img.clientHeight,
              });
            }
          });

          const svgs: string[] = [];
          document.querySelectorAll('svg').forEach((svg) => {
            svgs.push(svg.outerHTML);
          });

          // Extract Computed Style Tokens for Key Typography / Colors
          const computedColors = new Set<string>();
          const computedFonts = new Set<string>();

          const allElems = Array.from(document.querySelectorAll('*')).slice(0, 300);
          allElems.forEach((el) => {
            const cs = window.getComputedStyle(el);
            if (cs.color) computedColors.add(cs.color);
            if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') {
              computedColors.add(cs.backgroundColor);
            }
            if (cs.fontFamily) computedFonts.add(cs.fontFamily);
          });

          return {
            title: document.title,
            bodyHtml: document.body ? document.body.innerHTML.slice(0, 20000) : '',
            links,
            imgs,
            svgsCount: svgs.length,
            computedColors: Array.from(computedColors),
            computedFonts: Array.from(computedFonts),
          };
        });

        domDataMap[pagePath] = pageExtraction;
        stylesMap[pagePath] = {
          colors: pageExtraction.computedColors,
          fonts: pageExtraction.computedFonts,
        };

        const routeId = `route_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const routeNode: RouteNode = {
          id: routeId,
          projectId,
          url: current.url,
          path: pagePath,
          title,
          status: 'crawled',
          depth: current.depth,
          parentPath: current.parentPath,
          metadata: {
            screenshotPath,
            imgsCount: pageExtraction.imgs.length,
            svgsCount: pageExtraction.svgsCount,
          },
        };

        routes.push(routeNode);

        // Save route to DB
        const stmtRoute = db.prepare(`
          INSERT OR REPLACE INTO routes (id, projectId, url, path, title, status, depth, parentPath, metadata)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmtRoute.run(
          routeNode.id,
          routeNode.projectId,
          routeNode.url,
          routeNode.path,
          routeNode.title || '',
          routeNode.status,
          routeNode.depth,
          routeNode.parentPath || '',
          JSON.stringify(routeNode.metadata || {})
        );

        // Discover child links
        for (const rawLink of pageExtraction.links) {
          try {
            const absoluteUrl = new URL(rawLink, current.url).href;
            const parsedLink = new URL(absoluteUrl);
            if (parsedLink.origin === targetOrigin && !visitedUrls.has(absoluteUrl)) {
              queue.push({
                url: absoluteUrl,
                depth: current.depth + 1,
                parentPath: pagePath,
              });
            }
          } catch {
            // Ignore invalid URLs
          }
        }

        await page.close();
      }
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    return {
      routes,
      assets,
      domData: domDataMap,
      computedStyles: stylesMap,
    };
  }
}
