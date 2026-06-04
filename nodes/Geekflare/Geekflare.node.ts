import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  IDataObject,
} from "n8n-workflow";

export class Geekflare implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Geekflare",
    name: "geekflare",
    icon: "file:geekflare.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description:
      "Web scraping, screenshots, DNS, SEO audits, security checks and more via the Geekflare API",
    defaults: {
      name: "Geekflare",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "geekflareApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "Broken Link Check",
            value: "brokenlink",
            description: "Find broken links on a webpage",
          },
          {
            name: "DNS Record Lookup",
            value: "dnsrecord",
            description: "Retrieve DNS records for a domain",
          },
          {
            name: "DNSSEC Check",
            value: "dnssec",
            description: "Verify DNSSEC configuration",
          },
          {
            name: "HTTP Header Inspect",
            value: "httpheader",
            description: "Retrieve HTTP response headers",
          },
          {
            name: "HTTP Protocol Check",
            value: "httpprotocol",
            description: "Detect which HTTP version a server uses",
          },
          {
            name: "Lighthouse Audit",
            value: "lighthouse",
            description: "Run a Google Lighthouse performance audit",
          },
          {
            name: "Load Time",
            value: "loadtime",
            description: "Measure full page load time",
          },
          {
            name: "Meta Scraping",
            value: "metascraping",
            description: "Extract meta tags and Open Graph data",
          },
          {
            name: "Mixed Content Check",
            value: "mixedcontent",
            description: "Detect HTTP resources on HTTPS pages",
          },
          {
            name: "MTR Trace",
            value: "mtr",
            description: "Run an MTR network trace to a host",
          },
          {
            name: "Open Port Scan",
            value: "openport",
            description: "Scan for open ports on a host",
          },
          {
            name: "Ping",
            value: "ping",
            description: "Ping a host and measure latency",
          },
          {
            name: "Redirect Chain Check",
            value: "redirectcheck",
            description: "Trace all redirects for a URL",
          },
          {
            name: "Screenshot",
            value: "screenshot",
            description: "Capture a full screenshot of a webpage",
          },
          {
            name: "Search",
            value: "search",
            description: "Perform a web, news, or image search",
          },
          {
            name: "Site Up Check",
            value: "up",
            description: "Check if a website is online",
          },
          {
            name: "TLS/SSL Scan",
            value: "tlsscan",
            description: "Analyze TLS/SSL certificate and configuration",
          },
          {
            name: "TTFB Measurement",
            value: "ttfb",
            description: "Measure Time to First Byte",
          },
          {
            name: "URL to PDF",
            value: "url2pdf",
            description: "Convert a webpage to a PDF file",
          },
          {
            name: "Web Scraping",
            value: "webscraping",
            description: "Scrape content from any webpage",
          },
        ],
        default: "webscraping",
      },
      {
        displayName: "URL",
        name: "url",
        type: "string",
        default: "",
        required: true,
        placeholder: "https://example.com",
        displayOptions: {
          show: {
            operation: [
              "webscraping",
              "metascraping",
              "screenshot",
              "dnsrecord",
              "up",
              "redirectcheck",
              "brokenlink",
              "url2pdf",
              "openport",
              "tlsscan",
              "ttfb",
              "loadtime",
              "httpheader",
              "httpprotocol",
              "mixedcontent",
              "dnssec",
              "mtr",
              "ping",
              "lighthouse",
            ],
          },
        },
      },

      // ── Web Scraping ──────────────────────────────────────────────
      {
        displayName: "Formats",
        name: "format",
        type: "multiOptions",
        options: [
          { name: "HTML", value: "html" },
          { name: "HTML LLM", value: "html-llm" },
          { name: "JSON", value: "json" },
          { name: "Markdown", value: "markdown" },
          { name: "Markdown LLM", value: "markdown-llm" },
          { name: "Text", value: "text" },
          { name: "Text LLM", value: "text-llm" },
        ],
        default: ["markdown"],
        description: "Output formats to return. Select up to 3.",
        displayOptions: { show: { operation: ["webscraping"] } },
      },
      {
        displayName: "Additional Options",
        name: "webscrapingOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: { show: { operation: ["webscraping"] } },
        options: [
          {
            displayName: "Block Ads",
            name: "blockAds",
            type: "boolean",
            default: true,
          },
          {
            displayName: "Device",
            name: "device",
            type: "options",
            options: [
              { name: "Desktop", value: "desktop" },
              { name: "Mobile", value: "mobile" },
            ],
            default: "desktop",
          },
          {
            displayName: "File Output",
            name: "fileOutput",
            type: "boolean",
            default: false,
            description:
              "Whether to generate a download URL for the scraped data",
          },
          {
            displayName: "Proxy Country",
            name: "proxyCountry",
            type: "string",
            default: "",
            placeholder: "us, gb, de, in ...",
          },
          {
            displayName: "Render JavaScript",
            name: "renderJS",
            type: "boolean",
            default: true,
            description:
              "Whether to execute JavaScript before extracting. Enable for dynamic sites.",
          },
          {
            displayName: "Stealth Mode",
            name: "stealth",
            type: "boolean",
            default: false,
            description:
              "Whether to bypass CAPTCHAs. Requests will take longer.",
          },
        ],
      },

      // ── Meta Scraping ─────────────────────────────────────────────
      {
        displayName: "Format",
        name: "metaFormat",
        type: "options",
        options: [
          { name: "JSON", value: "json" },
          { name: "Markdown", value: "markdown" },
        ],
        default: "json",
        displayOptions: { show: { operation: ["metascraping"] } },
      },
      {
        displayName: "Additional Options",
        name: "metascrapingOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: { show: { operation: ["metascraping"] } },
        options: [
          {
            displayName: "Block Ads",
            name: "blockAds",
            type: "boolean",
            default: true,
          },
          {
            displayName: "Device",
            name: "device",
            type: "options",
            options: [
              { name: "Desktop", value: "desktop" },
              { name: "Mobile", value: "mobile" },
            ],
            default: "desktop",
          },
          {
            displayName: "File Output",
            name: "fileOutput",
            type: "boolean",
            default: false,
          },
          {
            displayName: "Proxy Country",
            name: "proxyCountry",
            type: "string",
            default: "",
            placeholder: "us, gb, de, in ...",
          },
          {
            displayName: "Render JavaScript",
            name: "renderJS",
            type: "boolean",
            default: true,
          },
        ],
      },

      // ── Screenshot ────────────────────────────────────────────────
      {
        displayName: "Additional Options",
        name: "screenshotOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: { show: { operation: ["screenshot"] } },
        options: [
          {
            displayName: "Add Timestamp",
            name: "addTimestamp",
            type: "boolean",
            default: false,
          },
          {
            displayName: "Block Ads",
            name: "blockAds",
            type: "boolean",
            default: true,
          },
          {
            displayName: "Delay (seconds)",
            name: "delay",
            type: "number",
            default: 0,
            placeholder: "2",
          },
          {
            displayName: "Device",
            name: "device",
            type: "options",
            options: [
              { name: "Desktop", value: "desktop" },
              { name: "Mobile", value: "mobile" },
            ],
            default: "desktop",
          },
          {
            displayName: "Full Page",
            name: "fullPage",
            type: "boolean",
            default: false,
          },
          {
            displayName: "Hide Cookies Banner",
            name: "hideCookie",
            type: "boolean",
            default: true,
          },
          {
            displayName: "Highlight Links",
            name: "highlightLinks",
            type: "boolean",
            default: false,
          },
          {
            displayName: "Image Quality (1-100)",
            name: "quality",
            type: "number",
            default: 90,
          },
          {
            displayName: "Image Type",
            name: "type",
            type: "options",
            options: [
              { name: "JPEG", value: "jpeg" },
              { name: "PNG", value: "png" },
              { name: "WEBP", value: "webp" },
            ],
            default: "png",
          },
          {
            displayName: "Page Height (px)",
            name: "pageHeight",
            type: "number",
            default: 0,
            placeholder: "2000",
          },
          {
            displayName: "Proxy Country",
            name: "proxyCountry",
            type: "string",
            default: "",
            placeholder: "us, gb, de, in ...",
          },
          {
            displayName: "Scale Factor",
            name: "scaleFactor",
            type: "number",
            default: 1,
          },
          {
            displayName: "Skip CAPTCHA",
            name: "skipCaptcha",
            type: "boolean",
            default: true,
          },
          {
            displayName: "Viewport Height (px)",
            name: "viewportHeight",
            type: "number",
            default: 0,
            placeholder: "768",
          },
          {
            displayName: "Viewport Width (px)",
            name: "viewportWidth",
            type: "number",
            default: 0,
            placeholder: "1366",
          },
        ],
      },
      // ── DNS Record ────────────────────────────────────────────────
      {
        displayName: "DNS Record Types",
        name: "types",
        type: "multiOptions",
        options: [
          { name: "A", value: "A" },
          { name: "AAAA", value: "AAAA" },
          { name: "CAA", value: "CAA" },
          { name: "CNAME", value: "CNAME" },
          { name: "MX", value: "MX" },
          { name: "NS", value: "NS" },
          { name: "SOA", value: "SOA" },
          { name: "SRV", value: "SRV" },
          { name: "TXT", value: "TXT" },
        ],
        default: ["A", "AAAA", "CNAME", "MX", "NS"],
        displayOptions: { show: { operation: ["dnsrecord"] } },
      },

      // ── Site Up / Redirect / Broken Link / TTFB / HTTP Header / HTTP Protocol / MTR / Load Time / Mixed Content ──
      {
        displayName: "Additional Options",
        name: "commonOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
          show: {
            operation: [
              "up",
              "redirectcheck",
              "brokenlink",
              "ttfb",
              "httpheader",
              "httpprotocol",
              "mtr",
              "loadtime",
              "mixedcontent",
            ],
          },
        },
        options: [
          {
            displayName: "Follow Redirect",
            name: "followRedirect",
            type: "boolean",
            default: false,
          },
          {
            displayName: "Proxy Country",
            name: "proxyCountry",
            type: "string",
            default: "",
            placeholder: "us, gb, de, in ...",
          },
        ],
      },

      // ── URL to PDF ────────────────────────────────────────────────
      {
        displayName: "Additional Options",
        name: "url2pdfOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: { show: { operation: ["url2pdf"] } },
        options: [
          {
            displayName: "Add Timestamp",
            name: "addTimestamp",
            type: "boolean",
            default: false,
          },
          {
            displayName: "Device",
            name: "device",
            type: "options",
            options: [
              { name: "Desktop", value: "desktop" },
              { name: "Mobile", value: "mobile" },
            ],
            default: "desktop",
          },
          {
            displayName: "Hide Cookies Banner",
            name: "hideCookie",
            type: "boolean",
            default: true,
          },
          {
            displayName: "Margin Bottom (mm)",
            name: "marginBottom",
            type: "number",
            default: 25,
          },
          {
            displayName: "Margin Left (mm)",
            name: "marginLeft",
            type: "number",
            default: 25,
          },
          {
            displayName: "Margin Right (mm)",
            name: "marginRight",
            type: "number",
            default: 25,
          },
          {
            displayName: "Margin Top (mm)",
            name: "marginTop",
            type: "number",
            default: 25,
          },
          {
            displayName: "Orientation",
            name: "orientation",
            type: "options",
            options: [
              { name: "Landscape", value: "landscape" },
              { name: "Portrait", value: "portrait" },
            ],
            default: "portrait",
          },
          {
            displayName: "Paper Format",
            name: "format",
            type: "options",
            options: [
              { name: "A0", value: "a0" },
              { name: "A1", value: "a1" },
              { name: "A2", value: "a2" },
              { name: "A3", value: "a3" },
              { name: "A4", value: "a4" },
              { name: "A5", value: "a5" },
              { name: "A6", value: "a6" },
              { name: "Legal", value: "legal" },
              { name: "Letter", value: "letter" },
            ],
            default: "a4",
          },
          {
            displayName: "Proxy Country",
            name: "proxyCountry",
            type: "string",
            default: "",
            placeholder: "us, gb, de, in ...",
          },
          { displayName: "Scale", name: "scale", type: "number", default: 1 },
          {
            displayName: "Skip CAPTCHA",
            name: "skipCaptcha",
            type: "boolean",
            default: true,
          },
        ],
      },

      // ── Open Port Scan ────────────────────────────────────────────
      {
        displayName: "Additional Options",
        name: "openportOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: { show: { operation: ["openport"] } },
        options: [
          {
            displayName: "Custom Port Ranges",
            name: "portRanges",
            type: "string",
            default: "",
            placeholder: "80,443,1000-1010",
          },
          {
            displayName: "Top Ports",
            name: "topPorts",
            type: "options",
            options: [
              { name: "Top 50", value: "50" },
              { name: "Top 100", value: "100" },
              { name: "Top 500", value: "500" },
              { name: "Top 1000", value: "1000" },
              { name: "Top 5000", value: "5000" },
            ],
            default: "",
          },
        ],
      },

      // ── Lighthouse ────────────────────────────────────────────────
      {
        displayName: "Additional Options",
        name: "lighthouseOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: { show: { operation: ["lighthouse"] } },
        options: [
          {
            displayName: "Device",
            name: "device",
            type: "options",
            options: [
              { name: "Desktop", value: "desktop" },
              { name: "Mobile", value: "mobile" },
            ],
            default: "desktop",
          },
          {
            displayName: "Extra Parameters",
            name: "parameters",
            type: "string",
            default: "",
            placeholder: "--only-categories=seo",
          },
          {
            displayName: "Follow Redirect",
            name: "followRedirect",
            type: "boolean",
            default: false,
          },
          {
            displayName: "Proxy Country",
            name: "proxyCountry",
            type: "string",
            default: "",
            placeholder: "us, gb, de, in ...",
          },
        ],
      },

      // ── Search ────────────────────────────────────────────────────
      {
        displayName: "Search Query",
        name: "query",
        type: "string",
        default: "",
        required: true,
        placeholder: "best running shoes",
        displayOptions: { show: { operation: ["search"] } },
      },
      {
        displayName: "Additional Options",
        name: "searchOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: { show: { operation: ["search"] } },
        options: [
          {
            displayName: "Category",
            name: "category",
            type: "options",
            options: [
              { name: "Code", value: "code" },
              { name: "General", value: "general" },
              { name: "Research", value: "research" },
            ],
            default: "general",
          },
          {
            displayName: "Exclude Domains",
            name: "excludeDomains",
            type: "string",
            default: "",
            placeholder: "pinterest.com",
          },
          {
            displayName: "Format",
            name: "format",
            type: "options",
            options: [
              { name: "HTML", value: "html" },
              { name: "JSON", value: "json" },
              { name: "Markdown", value: "markdown" },
            ],
            default: "json",
          },
          {
            displayName: "Grounded Answer",
            name: "groundedAnswer",
            type: "boolean",
            default: false,
            description:
              "Whether to generate an AI answer synthesized from search results",
          },
          {
            displayName: "Include Domains",
            name: "includeDomains",
            type: "string",
            default: "",
            placeholder: "reddit.com,stackoverflow.com",
          },
          {
            displayName: "Location / Country",
            name: "location",
            type: "string",
            default: "",
            placeholder: "us, gb, de, in ...",
          },
          {
            displayName: "Result Limit",
            name: "limit",
            type: "number",
            default: 10,
          },
          {
            displayName: "Scrape Limit",
            name: "scrapeLimit",
            type: "number",
            default: 3,
          },
          {
            displayName: "Scrape Results",
            name: "scrape",
            type: "boolean",
            default: false,
          },
          {
            displayName: "Source",
            name: "source",
            type: "options",
            options: [
              { name: "Images", value: "images" },
              { name: "News", value: "news" },
              { name: "Web", value: "web" },
            ],
            default: "web",
          },
          {
            displayName: "Time Filter",
            name: "time",
            type: "string",
            default: "",
            placeholder: "any, d, w, m, y, d7, h6",
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // We will fill this in later
    return [[]];
  }
}
