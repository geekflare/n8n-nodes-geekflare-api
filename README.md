# n8n-nodes-geekflare-api

Official n8n community node for the [Geekflare API](https://geekflare.com/api/). Use Geekflare's web intelligence tools directly inside your n8n workflows — no code required.

## What you can do

- **Scrape** any webpage and get back clean HTML, Markdown, JSON, or LLM-ready text
- **Capture screenshots** with full-page, Retina, and CAPTCHA-bypass support
- **Search the web** with structured results and optional AI-grounded answers
- **Convert URLs to PDF** with full layout control
- **Run DNS, TLS, HTTP, and port diagnostics** on any domain
- **Audit performance** with Lighthouse, TTFB, and load time checks
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

## Operations

### Web Scraping

Scrape full page content from any URL. Returns HTML, Markdown, JSON, or LLM-optimised text.

| Parameter      | Type                  | Default        | Description                                                                                          |
| -------------- | --------------------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| `url` \*       | string                | —              | Target URL                                                                                           |
| `formats`      | array                 | `["markdown"]` | Output formats (up to 3): `html`, `markdown`, `json`, `markdown-llm`, `html-llm`, `text`, `text-llm` |
| `device`       | `desktop` \| `mobile` | `desktop`      | Device to emulate                                                                                    |
| `proxyCountry` | string                | —              | Route through a country ISO code (e.g. `us`)                                                         |
| `renderJS`     | boolean               | `true`         | Execute JavaScript before extracting. Disable for faster static scrapes                              |
| `fileOutput`   | boolean               | `false`        | Return a download URL instead of inline content                                                      |
| `blockAds`     | boolean               | `true`         | Block ads during scrape                                                                              |
| `stealth`      | boolean               | `false`        | Bypass CAPTCHAs (slower)                                                                             |

---

### Meta Scraping

Scrape meta tags — title, description, Open Graph, Twitter cards, and more.

| Parameter      | Type                  | Default   | Description      |
| -------------- | --------------------- | --------- | ---------------- |
| `url` \*       | string                | —         | Target URL       |
| `format`       | `json` \| `markdown`  | `json`    | Output format    |
| `device`       | `desktop` \| `mobile` | `desktop` |                  |
| `proxyCountry` | string                | —         | Country ISO code |
| `renderJS`     | boolean               | `true`    |                  |
| `fileOutput`   | boolean               | `false`   |                  |
| `blockAds`     | boolean               | `true`    |                  |

---

### Screenshot

Capture a screenshot of any website. Supports full-page, Retina, and AI-friendly link highlighting.

| Parameter        | Type                      | Default   | Description                                                    |
| ---------------- | ------------------------- | --------- | -------------------------------------------------------------- |
| `url` \*         | string                    | —         | Target URL                                                     |
| `device`         | `desktop` \| `mobile`     | `desktop` |                                                                |
| `type`           | `png` \| `jpeg` \| `webp` | `png`     |                                                                |
| `proxyCountry`   | string                    | —         | Country ISO code                                               |
| `fullPage`       | boolean                   | `false`   |                                                                |
| `blockAds`       | boolean                   | `true`    |                                                                |
| `hideCookie`     | boolean                   | `true`    | Remove cookie banners                                          |
| `skipCaptcha`    | boolean                   | `true`    | Bypass Cloudflare / reCAPTCHA                                  |
| `addTimestamp`   | boolean                   | `false`   |                                                                |
| `highlightLinks` | boolean                   | `false`   | Draw borders around links/buttons — great for AI vision models |
| `pageHeight`     | number                    | —         | Custom page height (px)                                        |
| `viewportWidth`  | number                    | —         | Viewport width (px, default 1366)                              |
| `viewportHeight` | number                    | —         | Viewport height (px, default 768)                              |
| `delay`          | number                    | —         | Seconds to wait after page load                                |
| `quality`        | number                    | `90`      | Image quality 1–100                                            |
| `scaleFactor`    | number                    | —         | Device pixel ratio (use 2–3 for Retina)                        |

---

### Search

Search the web and return clean, structured results. Supports web, news, and image search with optional AI-grounded answers.

| Parameter        | Type                              | Default | Description                                        |
| ---------------- | --------------------------------- | ------- | -------------------------------------------------- |
| `query` \*       | string                            | —       | Search query                                       |
| `limit`          | number                            | `10`    | Number of results                                  |
| `time`           | string                            | —       | Time filter: `any`, `d`, `w`, `m`, `y`, `d7`, `h6` |
| `location`       | string                            | —       | Country ISO code to localise results               |
| `source`         | `web` \| `news` \| `images`       | `web`   |                                                    |
| `category`       | `general` \| `code` \| `research` | —       |                                                    |
| `format`         | `json` \| `markdown` \| `html`    | `json`  |                                                    |
| `includeDomains` | string                            | —       | Comma-separated domains to include                 |
| `excludeDomains` | string                            | —       | Comma-separated domains to exclude                 |
| `groundedAnswer` | boolean                           | `false` | Generate an AI answer synthesised from results     |
| `scrape`         | boolean                           | `false` | Also scrape top result pages                       |
| `scrapeLimit`    | number                            | —       | How many pages to scrape (requires `scrape: true`) |

---

### URL to PDF

Convert any URL to a downloadable PDF.

| Parameter      | Type                                           | Default    | Description                       |
| -------------- | ---------------------------------------------- | ---------- | --------------------------------- |
| `url` \*       | string                                         | —          | Target URL                        |
| `device`       | `desktop` \| `mobile`                          | `desktop`  |                                   |
| `format`       | `a4` `a3` `a5` `a6` `letter` `legal` `a0`–`a2` | `a4`       | Paper size                        |
| `orientation`  | `portrait` \| `landscape`                      | `portrait` |                                   |
| `proxyCountry` | string                                         | —          | Country ISO code                  |
| `scale`        | number                                         | —          | Zoom level (e.g. `0.8` to shrink) |
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
| `url` \*  | string                                                        | —                                    |
| `types`   | array of `A` `AAAA` `CNAME` `MX` `NS` `SOA` `TXT` `CAA` `SRV` | `["A", "AAAA", "CNAME", "MX", "NS"]` |

---

### Site Up Check

Check if a site is up or down.

| Parameter        | Type    | Default |
| ---------------- | ------- | ------- |
| `url` \*         | string  | —       |
| `proxyCountry`   | string  | —       |
| `followRedirect` | boolean | `false` |

---

### Redirect Chain Check

Trace the full redirect chain of a URL.

| Parameter      | Type   |
| -------------- | ------ |
| `url` \*       | string |
| `proxyCountry` | string |

---

### Broken Link Check

Find all broken links on a webpage.

| Parameter        | Type    | Default |
| ---------------- | ------- | ------- |
| `url` \*         | string  | —       |
| `proxyCountry`   | string  | —       |
| `followRedirect` | boolean | `false` |

---

### Open Port Scan

Scan open ports on a host.

| Parameter    | Type                           | Description                           |
| ------------ | ------------------------------ | ------------------------------------- |
| `url` \*     | string                         | Target URL or hostname                |
| `topPorts`   | `50` `100` `500` `1000` `5000` | Scan top N common ports               |
| `portRanges` | string                         | Custom ranges e.g. `80,443,1000-1010` |

---

### TLS/SSL Scan

Inspect TLS/SSL configuration — protocols, ciphers, certificate details.

| Parameter | Type   |
| --------- | ------ |
| `url` \*  | string |

---

### Lighthouse Audit

Run a full Lighthouse audit — performance, SEO, accessibility, and best practices.

| Parameter        | Type                  | Default   | Description                                               |
| ---------------- | --------------------- | --------- | --------------------------------------------------------- |
| `url` \*         | string                | —         |                                                           |
| `device`         | `desktop` \| `mobile` | `desktop` |                                                           |
| `proxyCountry`   | string                | —         | Country ISO code                                          |
| `followRedirect` | boolean               | `false`   |                                                           |
| `parameters`     | string                | —         | Extra Lighthouse CLI flags (e.g. `--only-categories=seo`) |

---

### Load Time

Measure full page load time from any location.

| Parameter        | Type    | Default |
| ---------------- | ------- | ------- |
| `url` \*         | string  | —       |
| `proxyCountry`   | string  | —       |
| `followRedirect` | boolean | `false` |

---

### TTFB Measurement

Measure Time To First Byte (TTFB).

| Parameter        | Type    | Default |
| ---------------- | ------- | ------- |
| `url` \*         | string  | —       |
| `followRedirect` | boolean | `false` |

---

### HTTP Header Inspect

Retrieve HTTP response headers for a URL.

| Parameter        | Type    | Default |
| ---------------- | ------- | ------- |
| `url` \*         | string  | —       |
| `proxyCountry`   | string  | —       |
| `followRedirect` | boolean | `false` |

---

### HTTP Protocol Check

Check which HTTP protocol versions (HTTP/1.1, HTTP/2, HTTP/3) a server supports.

| Parameter        | Type    | Default |
| ---------------- | ------- | ------- |
| `url` \*         | string  | —       |
| `followRedirect` | boolean | `false` |

---

### Mixed Content Check

Detect mixed content issues (HTTP resources on HTTPS pages).

| Parameter        | Type    | Default |
| ---------------- | ------- | ------- |
| `url` \*         | string  | —       |
| `proxyCountry`   | string  | —       |
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
| `url` \*         | string  | —       |
| `proxyCountry`   | string  | —       |
| `followRedirect` | boolean | `false` |

---

### Ping

Ping a host and return latency.

| Parameter | Type   |
| --------- | ------ |
| `url` \*  | string |

---

## Links

- [Geekflare API](https://geekflare.com/api/)
- [API Documentation](https://docs.geekflare.com/api/intro)
- [Dashboard](https://dash.geekflare.com/)
- [Report Issues](https://geekflare.com/contact/?product=api&topic=bug)

## License

MIT
