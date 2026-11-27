# n8n-nodes-geekflare-api

Official n8n community node for the [Geekflare](https://geekflare.com/api/). Use Geekflare's web intelligence tools directly inside your n8n workflows, no code required.

## What you can do

- **Scrape** any webpage and get back clean HTML, Markdown, JSON, or LLM-ready text, including structured data via extraction templates or AI prompts
- **Crawl** entire websites asynchronously or synchronously, with URL filters, depth limits, webhooks, and ZIP download of the results
- **Map** a website to discover all of its URLs, as a blocking call or a background job
- **Capture screenshots** with full-page, Retina, element selector, theme, and CAPTCHA-bypass support
- **Search the web** with structured results, optional AI-grounded answers, or the full Google results page (SERP)
- **Convert URLs to PDF** with full layout control
- **Run DNS, TLS, and port diagnostics** on any domain
- **Audit performance** with Lighthouse and load time checks
- **Monitor uptime**, redirect chains, broken links, and mixed content

## Installation

In your n8n instance, go to **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-geekflare-api
```

## Get an API Key

Sign up at [geekflare.com/api](https://geekflare.com/api) and copy your API key from the dashboard.

## Credentials Setup

After installing the node:

1. Open any workflow and add a **Geekflare** node
2. Click **Create new credential** in the node panel
3. Paste your API key and save

## Resources and operations

Operations are grouped by resource in the node panel:

| Resource        | Operations                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| Page Content    | Web Scraping, Meta Scraping, Brand Extraction, Screenshot, URL to PDF                                    |
| Crawl           | Start, Start Sync, List, Get Status, Get Errors, Get Trace, Get Webhook Deliveries, Download, Cancel     |
| Map             | Get URLs, Start Async, Get Async Status                                                                  |
| Search          | Search                                                                                                   |
| Network         | DNS Record Lookup, DNSSEC Check, MTR Trace, Open Port Scan, Ping, TLS/SSL Scan                           |
| Site Monitoring | Site Up Check, Redirect Chain Check, Broken Link Check, Mixed Content Check, Load Time, Lighthouse Audit |

Workflows created with earlier versions of the node keep working unchanged.

## Operations

### Web Scraping

Scrape full page content from any URL. Returns HTML, Markdown, JSON, or LLM-optimised text, including structured data via ready-made extraction templates, custom CSS/XPath schemas, or AI-powered extraction.

| Parameter          | Type                                                    | Default        | Description                                                                                                                         |
| ------------------ | ------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `url` \*           | string                                                  | -              | Target URL                                                                                                                          |
| `formats`          | array                                                   | `["markdown"]` | Output formats (up to 3): `html`, `markdown`, `json`, `markdown-llm`, `html-llm`, `text`, `text-llm`                                |
| `device`           | `desktop` \| `mobile`                                   | `desktop`      | Device to emulate                                                                                                                   |
| `proxyMode`        | `false` \| `auto` \| `true`                             | `false`        | `false` never uses a proxy, `auto` retries via proxy if blocked, `true` always uses one                                             |
| `proxyCountry`     | string                                                  | -              | Route through a country ISO code (e.g. `us`), used when a proxy is active                                                           |
| `renderJS`         | boolean                                                 | auto           | Execute JavaScript before extracting. If left unset, resolved automatically based on whether the page needs it                      |
| `fileOutput`       | boolean                                                 | `false`        | Return a download URL instead of inline content                                                                                     |
| `blockAds`         | boolean                                                 | `true`         | Block ads during scrape                                                                                                             |
| `stealth`          | boolean                                                 | `false`        | Bypass CAPTCHAs (slower)                                                                                                            |
| `waitTime`         | number                                                  | `0`            | Seconds to wait after page load before capturing content                                                                            |
| `extractionMode`   | `default` \| `cssSchema` \| `xpathSchema` \| `template` | `default`      | JSON output is used automatically when an extraction mode other than `default` is requested                                         |
| `template`         | `product` \| `contact`                                  | -              | Ready-made extraction template when Extraction Mode is Template                                                                     |
| `extractionSchema` | JSON                                                    | -              | Custom field-extraction schema for CSS Schema/XPath Schema modes                                                                    |
| `aiPrompt`         | JSON                                                    | -              | AI-powered extraction/analysis of the scraped page (prompt, schema, listing, summary, sentiment, or keywords mode). Adds +7 credits |

---

### Crawl

Crawl a website starting from a seed URL. Use **Start** for large sites (returns a crawl ID you poll later, optionally with webhooks) or **Start Sync** for small sites where you want the pages in the same response.

#### Start / Start Sync

| Parameter         | Type                        | Default    | Description                                           |
| ----------------- | --------------------------- | ---------- | ----------------------------------------------------- |
| `url` \*          | string                      | -          | Seed URL                                              |
| `format`          | `html` \| `markdown`        | `markdown` | Output format for crawled pages                       |
| `device`          | `desktop` \| `mobile`       | `desktop`  | Device to emulate                                     |
| `maxDepth`        | number                      | `3`        | Maximum number of hops from the seed URL              |
| `maxPages`        | number                      | `500`      | Maximum number of pages to crawl                      |
| `maxRetries`      | number                      | `1`        | Retries per page before it is counted as failed       |
| `timeout`         | number                      | `99`       | Timeout in seconds                                    |
| `allowPatterns`   | comma-separated string      | -          | URL patterns to include, e.g. `/blog/*,/docs/*`       |
| `denyPatterns`    | comma-separated string      | -          | URL patterns to skip, e.g. `/login,/cart/*`           |
| `includeExternal` | boolean                     | `false`    | Follow links to other domains                         |
| `renderJS`        | boolean                     | `true`     | Execute JavaScript before extracting                  |
| `blockAds`        | boolean                     | `true`     | Block ads during crawl                                |
| `proxyMode`       | `false` \| `auto` \| `true` | `false`    | Pages that succeed through a proxy cost extra credits |
| `proxyCountry`    | string                      | -          | Country ISO code, used when a proxy is active         |

**Start only** also accepts webhook settings:

| Parameter       | Type   | Default                 | Description                                                                                                                                                         |
| --------------- | ------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `webhookUrl`    | string | -                       | HTTPS URL that receives job events. The signing secret is returned once, when the crawl is created                                                                  |
| `webhookEvents` | array  | all except `crawl.page` | `crawl.started`, `crawl.page`, `crawl.completed`, `crawl.failed`, `crawl.cancelled`, `crawl.on_hold`, `crawl.resumed`. `crawl.page` sends one call per crawled page |

#### Manage a crawl

| Operation              | Parameters                                   | Description                                         |
| ---------------------- | -------------------------------------------- | --------------------------------------------------- |
| List                   | `status`, `limit` (default `50`), `offset`   | List your crawls, optionally filtered by status     |
| Get Status             | `crawlId` \*, `limit`, `offset`              | Status, progress, timing, and crawled pages         |
| Get Errors             | `crawlId` \*, `errorType`, `limit`, `offset` | Failed pages with error details                     |
| Get Trace              | `crawlId` \*, `traceUrl` \*                  | Show how a URL was reached from the seed            |
| Get Webhook Deliveries | `crawlId` \*, `limit`, `offset`              | List webhook deliveries for a crawl                 |
| Download               | `crawlId` \*, `retry`                        | Get a ZIP of the crawled pages; `retry` rebuilds it |
| Cancel                 | `crawlId` \*                                 | Cancel a running crawl                              |

Crawl statuses: `queued`, `running`, `completed`, `failed`, `cancelled`, `on_hold`.

---

### Map

Discover the URLs of a website without fetching page content.

#### Get URLs / Start Async

| Parameter         | Type                   | Default | Description                                                                                   |
| ----------------- | ---------------------- | ------- | --------------------------------------------------------------------------------------------- |
| `url` \*          | string                 | -       | Seed URL                                                                                      |
| `maxDepth`        | number                 | `3`     | Maximum number of hops from the seed URL                                                      |
| `maxPages`        | number                 | `500`   | Maximum number of URLs to return                                                              |
| `timeout`         | number                 | `99`    | Timeout in seconds                                                                            |
| `allowPatterns`   | comma-separated string | -       | URL patterns to include                                                                       |
| `denyPatterns`    | comma-separated string | -       | URL patterns to skip                                                                          |
| `includeExternal` | boolean                | `false` | Follow links to other domains                                                                 |
| `webhookUrl`      | string                 | -       | **Start Async only.** HTTPS URL that receives job events. The signing secret is returned once |

**Get URLs** waits for the result. **Start Async** runs the map as a background job and returns a job ID.

#### Get Async Status

| Parameter  | Type   | Description                |
| ---------- | ------ | -------------------------- |
| `jobId` \* | string | ID returned by Start Async |

---

### Meta Scraping

Scrape meta tags: title, description, Open Graph, Twitter cards, and more.

| Parameter      | Type                  | Default   | Description      |
| -------------- | --------------------- | --------- | ---------------- |
| `url` \*       | string                | -         | Target URL       |
| `format`       | `json` \| `markdown`  | `json`    | Output format    |
| `device`       | `desktop` \| `mobile` | `desktop` |                  |
| `proxyCountry` | string                | -         | Country ISO code |
| `renderJS`     | boolean               | `true`    |                  |
| `fileOutput`   | boolean               | `false`   |                  |
| `blockAds`     | boolean               | `true`    |                  |

---

### Screenshot

Capture a screenshot of any website. Supports full-page, Retina, element capture, theming, and AI-friendly link highlighting.

| Parameter               | Type                        | Default   | Description                                                         |
| ----------------------- | --------------------------- | --------- | ------------------------------------------------------------------- |
| `url` \*                | string                      | -         | Target URL                                                          |
| `device`                | `desktop` \| `mobile`       | `desktop` |                                                                     |
| `type`                  | `png` \| `jpeg` \| `webp`   | `png`     |                                                                     |
| `proxyCountry`          | string                      | -         | Country ISO code                                                    |
| `fullPage`              | boolean                     | `false`   |                                                                     |
| `selector`              | string                      | -         | CSS selector of the element to capture instead of the viewport/page |
| `fallbackToFullPage`    | boolean                     | `false`   | Fall back to a full-page capture if the selector is not found       |
| `captureBeyondViewport` | boolean                     | `false`   | Allow the capture to include content beyond the configured viewport |
| `theme`                 | `auto` \| `light` \| `dark` | `auto`    | Color scheme to render before capturing                             |
| `disableAnimations`     | boolean                     | `false`   | Freeze CSS/JS animations and transitions before capturing           |
| `removeBackground`      | boolean                     | `false`   | Transparent background (PNG only)                                   |
| `inline`                | boolean                     | `false`   | Return image data inline instead of a CDN URL                       |
| `blockAds`              | boolean                     | `true`    |                                                                     |
| `hideCookie`            | boolean                     | `true`    | Remove cookie banners                                               |
| `skipCaptcha`           | boolean                     | `true`    | Bypass Cloudflare / reCAPTCHA                                       |
| `addTimestamp`          | boolean                     | `false`   |                                                                     |
| `highlightLinks`        | boolean                     | `false`   | Draw borders around links/buttons, great for AI vision models       |
| `pageHeight`            | number                      | -         | Custom page height (px)                                             |
| `viewportWidth`         | number                      | -         | Viewport width (px, default 1366)                                   |
| `viewportHeight`        | number                      | -         | Viewport height (px, default 768)                                   |
| `delay`                 | number                      | -         | Seconds to wait after page load                                     |
| `quality`               | number                      | `90`      | Image quality 1-100                                                 |
| `scaleFactor`           | number                      | -         | Device pixel ratio (use 2-3 for Retina)                             |

---

### Search

Search the web and return clean, structured results. Supports web, news, and image search, optional AI-grounded answers, and the full Google results page.

| Parameter        | Type                                                               | Default   | Description                                                                                                          |
| ---------------- | ------------------------------------------------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------- |
| `query` \*       | string                                                             | -         | Search query                                                                                                         |
| `limit`          | number                                                             | `10`      | Number of results                                                                                                    |
| `time`           | string                                                             | -         | Time filter: `any`, `d`, `w`, `m`, `y`, `d7`, `h6`                                                                   |
| `location`       | string                                                             | -         | Country ISO code to localise results                                                                                 |
| `city`           | string                                                             | -         | City for localised results, e.g. `London,England,United Kingdom`. Takes priority over `location`                     |
| `device`         | `desktop` \| `mobile`                                              | `desktop` | Device to emulate when searching                                                                                     |
| `source`         | `web` \| `news` \| `images`                                        | `web`     |                                                                                                                      |
| `category`       | `general` \| `code` \| `pdf` \| `research` \| `linkedin` \| `wiki` | -         | Ignored in SERP mode                                                                                                 |
| `format`         | `json` \| `markdown` \| `html`                                     | `json`    | Ignored in SERP mode                                                                                                 |
| `includeDomains` | string                                                             | -         | Comma-separated domains to include                                                                                   |
| `excludeDomains` | string                                                             | -         | Comma-separated domains to exclude                                                                                   |
| `groundedAnswer` | boolean                                                            | `false`   | Generate an AI answer synthesised from results. Ignored in SERP mode                                                 |
| `scrape`         | boolean                                                            | `false`   | Also scrape top result pages. Ignored in SERP mode                                                                   |
| `scrapeLimit`    | number                                                             | -         | How many pages to scrape (requires `scrape: true`)                                                                   |
| `serp`           | boolean                                                            | `false`   | Return the full Google results page: organic results, AI Overview, related searches, People Also Ask, and pagination |

---

### URL to PDF

Convert any URL to a downloadable PDF.

| Parameter      | Type                                           | Default    | Description                       |
| -------------- | ---------------------------------------------- | ---------- | --------------------------------- |
| `url` \*       | string                                         | -          | Target URL                        |
| `device`       | `desktop` \| `mobile`                          | `desktop`  |                                   |
| `format`       | `a4` `a3` `a5` `a6` `letter` `legal` `a0`-`a2` | `a4`       | Paper size                        |
| `orientation`  | `portrait` \| `landscape`                      | `portrait` |                                   |
| `proxyCountry` | string                                         | -          | Country ISO code                  |
| `scale`        | number                                         | -          | Zoom level (e.g. `0.8` to shrink) |
| `marginTop`    | number                                         | `25`       | Top margin (mm)                   |
| `marginBottom` | number                                         | `25`       | Bottom margin (mm)                |
| `marginLeft`   | number                                         | `25`       | Left margin (mm)                  |
| `marginRight`  | number                                         | `25`       | Right margin (mm)                 |
| `hideCookie`   | boolean                                        | `true`     | Remove cookie banners             |
| `skipCaptcha`  | boolean                                        | `true`     | Bypass anti-bot challenges        |
| `addTimestamp` | boolean                                        | `false`    |                                   |

---

### DNS Record Lookup

Look up DNS records for a domain.

| Parameter | Type                                                          | Default                              |
| --------- | ------------------------------------------------------------- | ------------------------------------ |
| `url` \*  | string                                                        | -                                    |
| `types`   | array of `A` `AAAA` `CNAME` `MX` `NS` `SOA` `TXT` `CAA` `SRV` | `["A", "AAAA", "CNAME", "MX", "NS"]` |

---

### Site Up Check

Check if a site is up or down.

| Parameter        | Type    | Default |
| ---------------- | ------- | ------- |
| `url` \*         | string  | -       |
| `proxyCountry`   | string  | -       |
| `followRedirect` | boolean | `false` |

---

### Redirect Chain Check

Trace the full redirect chain of a URL.

| Parameter      | Type   | Default |
| -------------- | ------ | ------- |
| `url` \*       | string | -       |
| `proxyCountry` | string | -       |

---

### Broken Link Check

Find all broken links on a webpage.

| Parameter        | Type    | Default |
| ---------------- | ------- | ------- |
| `url` \*         | string  | -       |
| `proxyCountry`   | string  | -       |
| `followRedirect` | boolean | `false` |

---

### Open Port Scan

Scan open ports on a host, with optional service and version detection on the ports found open.

| Parameter        | Type                           | Default | Description                                                                          |
| ---------------- | ------------------------------ | ------- | ------------------------------------------------------------------------------------ |
| `url` \*         | string                         | -       | Target URL or hostname                                                               |
| `topPorts`       | `50` `100` `500` `1000` `5000` | -       | Scan top N common ports                                                              |
| `portRanges`     | string                         | -       | Custom ranges e.g. `80,443,1000-1010`                                                |
| `detectServices` | boolean                        | `false` | Run service and version detection on the open ports found. Slower than the base scan |

---

### TLS/SSL Scan

Inspect TLS/SSL configuration: protocols, ciphers, certificate details.

| Parameter | Type   |
| --------- | ------ |
| `url` \*  | string |

---

### Lighthouse Audit

Run a full Lighthouse audit: performance, SEO, accessibility, and best practices.

| Parameter        | Type                  | Default   | Description                                                                                     |
| ---------------- | --------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `url` \*         | string                | -         |                                                                                                 |
| `device`         | `desktop` \| `mobile` | `desktop` |                                                                                                 |
| `proxyCountry`   | string                | -         | Country ISO code                                                                                |
| `followRedirect` | boolean               | `false`   |                                                                                                 |
| `parameters`     | string                | -         | Extra Lighthouse CLI flags, separated by spaces (e.g. `--only-categories=seo --preset=desktop`) |

---

### Load Time

Measure full page load time from any location. Optionally test reachability from multiple locations at once.

| Parameter         | Type                   | Default | Description                                                                                                                |
| ----------------- | ---------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| `url` \*          | string                 | -       |                                                                                                                            |
| `proxyCountry`    | string                 | -       |                                                                                                                            |
| `followRedirect`  | boolean                | `false` |                                                                                                                            |
| `targetCountries` | comma-separated string | -       | Up to 3 ISO country codes to also test via proxy, alongside the default US test. Returns a per-location breakdown when set |

---

### Mixed Content Check

Detect mixed content issues (HTTP resources on HTTPS pages).

| Parameter        | Type    | Default |
| ---------------- | ------- | ------- |
| `url` \*         | string  | -       |
| `proxyCountry`   | string  | -       |
| `followRedirect` | boolean | `false` |

---

### DNSSEC Check

Check if DNSSEC is enabled and properly configured for a domain.

| Parameter | Type   |
| --------- | ------ |
| `url` \*  | string |

---

### MTR Trace

Run an MTR (My Traceroute) network diagnostic test.

| Parameter        | Type    | Default |
| ---------------- | ------- | ------- |
| `url` \*         | string  | -       |
| `proxyCountry`   | string  | -       |
| `followRedirect` | boolean | `false` |

---

### Ping

Ping a host and return latency.

| Parameter | Type   |
| --------- | ------ |
| `url` \*  | string |

---

### Brand Extraction

Extract a website's brand identity and design system. Standard mode returns core brand assets and design information; enriched mode adds company and brand intelligence when available.

| Parameter     | Type                     | Default    | Description                                                                        |
| ------------- | ------------------------ | ---------- | ---------------------------------------------------------------------------------- |
| **`url`** \*  | string                   | -          | Target URL                                                                         |
| **`mode`**    | `standard` \| `enriched` | `standard` | Extraction depth. Enriched mode includes additional company and brand intelligence |
| **`refresh`** | boolean                  | `false`    | Force a fresh extraction instead of using cached brand data                        |

Brand results can include logos, colors, fonts, typography, components, spacing, social profiles, links, page metadata, and company information.

---

## Links

- [Geekflare API](https://geekflare.com/api/)
- [API Documentation](https://docs.geekflare.com/api/intro)
- [Dashboard](https://dash.geekflare.com/)
- [Report Issues](https://geekflare.com/contact/?product=api&topic=bug)

## License

MIT
