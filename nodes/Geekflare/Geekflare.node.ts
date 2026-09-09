import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  IDataObject,
  NodeApiError,
  JsonObject,
} from "n8n-workflow";

export class Geekflare implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Geekflare",
    name: "geekflare",
    icon: "file:favicon.svg",
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
            name: "Brand Extraction",
            value: "brand",
            description:
              "Extract brand identity and design information from a website",
          },
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
              "loadtime",
              "mixedcontent",
              "dnssec",
              "mtr",
              "ping",
              "lighthouse",
              "brand",
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
            displayName: "AI Prompt (JSON)",
            name: "aiPrompt",
            type: "json",
            default: "{}",
            description:
              'AI-powered extraction/analysis of the scraped page, e.g. {"type": "prompt", "query": "What is the return policy?"}. Adds +6 credits.',
          },
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
            displayName: "Extraction Mode",
            name: "extractionMode",
            type: "options",
            options: [
              { name: "Default", value: "default" },
              { name: "CSS Schema", value: "cssSchema" },
              { name: "XPath Schema", value: "xpathSchema" },
              { name: "Template", value: "template" },
            ],
            default: "default",
            description: "Only used when Formats includes JSON",
          },
          {
            displayName: "Extraction Schema (JSON)",
            name: "extractionSchema",
            type: "json",
            default: "{}",
            description:
              "Custom field-extraction schema used with the CSS Schema/XPath Schema extraction modes",
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
            description: "Used when a proxy is active",
          },
          {
            displayName: "Proxy Mode",
            name: "proxyMode",
            type: "options",
            options: [
              { name: "Never (Default)", value: "false" },
              { name: "Auto (Retry via Proxy If Blocked)", value: "auto" },
              { name: "Always", value: "true" },
            ],
            default: "false",
          },
          {
            displayName: "Render JavaScript",
            name: "renderJS",
            type: "boolean",
            default: true,
            description:
              "Whether to execute JavaScript before extracting. If left unset, resolved automatically based on whether the page needs it.",
          },
          {
            displayName: "Stealth Mode",
            name: "stealth",
            type: "boolean",
            default: false,
            description:
              "Whether to bypass CAPTCHAs. Requests will take longer.",
          },
          {
            displayName: "Template",
            name: "template",
            type: "options",
            options: [
              { name: "Product", value: "product" },
              { name: "Contact", value: "contact" },
            ],
            default: "product",
            description: "Used when Extraction Mode is Template",
          },
          {
            displayName: "Wait Time (Seconds)",
            name: "waitTime",
            type: "number",
            default: 0,
            description:
              "Seconds to wait after page load before capturing content",
          },
        ],
      },

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
            displayName: "Capture Beyond Viewport",
            name: "captureBeyondViewport",
            type: "boolean",
            default: false,
            description:
              "Whether to allow the capture to include content beyond the configured viewport",
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
            displayName: "Disable Animations",
            name: "disableAnimations",
            type: "boolean",
            default: false,
            description:
              "Whether to freeze CSS/JS animations and transitions before capturing",
          },

          {
            displayName: "Fallback to Full Page",
            name: "fallbackToFullPage",
            type: "boolean",
            default: false,
            description:
              "Whether to fall back to a full-page capture if the selector is not found, instead of failing",
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
            displayName: "Inline",
            name: "inline",
            type: "boolean",
            default: false,
            description:
              "Whether to return image data inline instead of a CDN URL",
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
            displayName: "Remove Background",
            name: "removeBackground",
            type: "boolean",
            default: false,
            description:
              "Whether to remove the page background for a transparent PNG (PNG only)",
          },

          {
            displayName: "Scale Factor",
            name: "scaleFactor",
            type: "number",
            default: 1,
          },

          {
            displayName: "Selector",
            name: "selector",
            type: "string",
            default: "",
            placeholder: "#main-content",
            description:
              "CSS selector of the element to capture, instead of the full viewport/page",
          },

          {
            displayName: "Skip CAPTCHA",
            name: "skipCaptcha",
            type: "boolean",
            default: true,
          },

          {
            displayName: "Theme",
            name: "theme",
            type: "options",
            options: [
              { name: "Auto", value: "auto" },
              { name: "Dark", value: "dark" },
              { name: "Light", value: "light" },
            ],
            default: "auto",
            description: "Color scheme to render before capturing",
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
              "mtr",
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

      {
        displayName: "Additional Options",
        name: "loadtimeOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: { show: { operation: ["loadtime"] } },
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
          {
            displayName: "Target Countries",
            name: "targetCountries",
            type: "string",
            default: "",
            placeholder: "gb,ca",
            description:
              "Up to 3 comma-separated ISO country codes to also test reachability from via proxy, alongside the default US server test",
          },
        ],
      },

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
              { name: "LinkedIn", value: "linkedin" },
              { name: "PDF", value: "pdf" },
              { name: "Research", value: "research" },
              { name: "Wiki", value: "wiki" },
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
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const baseUrl = "https://api.geekflare.com";

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter("operation", i) as string;
      let body: IDataObject = {};

      try {
        if (operation === "webscraping") {
          const url = this.getNodeParameter("url", i) as string;
          const format = this.getNodeParameter("format", i) as string[];
          const opts = this.getNodeParameter(
            "webscrapingOptions",
            i,
          ) as IDataObject;
          const flat = stripEmpty(opts);

          if (flat.proxyMode !== undefined) {
            flat.proxyMode =
              flat.proxyMode === "true"
                ? true
                : flat.proxyMode === "false"
                  ? false
                  : flat.proxyMode;
          }
          if (flat.extractionSchema !== undefined) {
            const parsed = parseJsonField(flat.extractionSchema as string);
            if (parsed) flat.extractionSchema = parsed;
            else delete flat.extractionSchema;
          }
          if (flat.aiPrompt !== undefined) {
            const parsed = parseJsonField(flat.aiPrompt as string);
            if (parsed) flat.aiPrompt = parsed;
            else delete flat.aiPrompt;
          }

          body = { url, format, ...flat };
        } else if (operation === "metascraping") {
          const url = this.getNodeParameter("url", i) as string;
          const format = this.getNodeParameter("metaFormat", i) as string;
          const opts = this.getNodeParameter(
            "metascrapingOptions",
            i,
          ) as IDataObject;
          body = { url, format, ...stripEmpty(opts) };
        } else if (operation === "screenshot") {
          const url = this.getNodeParameter("url", i) as string;
          const opts = this.getNodeParameter(
            "screenshotOptions",
            i,
          ) as IDataObject;
          body = { url, ...stripEmpty(opts) };
        } else if (operation === "dnsrecord") {
          const url = this.getNodeParameter("url", i) as string;
          const types = this.getNodeParameter("types", i) as string[];
          body = { url, types };
        } else if (
          ["up", "redirectcheck", "brokenlink", "mtr", "mixedcontent"].includes(
            operation,
          )
        ) {
          const url = this.getNodeParameter("url", i) as string;
          const opts = this.getNodeParameter("commonOptions", i) as IDataObject;
          body = { url, ...stripEmpty(opts) };
        } else if (operation === "loadtime") {
          const url = this.getNodeParameter("url", i) as string;
          const opts = this.getNodeParameter(
            "loadtimeOptions",
            i,
          ) as IDataObject;
          const flat = stripEmpty(opts);
          if (flat.targetCountries !== undefined) {
            const targetCountries = (flat.targetCountries as string)
              .split(",")
              .map((c) => c.trim())
              .filter((c) => c.length > 0);
            delete flat.targetCountries;
            if (targetCountries.length > 0)
              flat.targetCountries = targetCountries;
          }
          body = { url, ...flat };
        } else if (["tlsscan", "dnssec", "ping"].includes(operation)) {
          const url = this.getNodeParameter("url", i) as string;
          body = { url };
        } else if (operation === "url2pdf") {
          const url = this.getNodeParameter("url", i) as string;
          const opts = this.getNodeParameter(
            "url2pdfOptions",
            i,
          ) as IDataObject;
          const flat = stripEmpty(opts);
          const margin: IDataObject = {};
          if (flat.marginTop !== undefined) {
            margin.top = flat.marginTop;
            delete flat.marginTop;
          }
          if (flat.marginBottom !== undefined) {
            margin.bottom = flat.marginBottom;
            delete flat.marginBottom;
          }
          if (flat.marginLeft !== undefined) {
            margin.left = flat.marginLeft;
            delete flat.marginLeft;
          }
          if (flat.marginRight !== undefined) {
            margin.right = flat.marginRight;
            delete flat.marginRight;
          }
          body = { url, ...flat };
          if (Object.keys(margin).length > 0) body.margin = margin;
        } else if (operation === "openport") {
          const url = this.getNodeParameter("url", i) as string;
          const opts = this.getNodeParameter(
            "openportOptions",
            i,
          ) as IDataObject;
          body = { url, ...stripEmpty(opts) };
        } else if (operation === "lighthouse") {
          const url = this.getNodeParameter("url", i) as string;
          const opts = this.getNodeParameter(
            "lighthouseOptions",
            i,
          ) as IDataObject;
          body = { url, ...stripEmpty(opts) };
        } else if (operation === "search") {
          const query = this.getNodeParameter("query", i) as string;
          const opts = this.getNodeParameter("searchOptions", i) as IDataObject;
          body = { query, ...stripEmpty(opts) };
        } else {
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i },
          );
        }

        const response = await this.helpers.httpRequestWithAuthentication.call(
          this,
          "geekflareApi",
          {
            method: "POST",
            url: `${baseUrl}/${operation}`,
            headers: {
              "Content-Type": "application/json",
            },
            body,
            json: true,
          },
        );
        const safeResponse = JSON.parse(
          JSON.stringify(response, getCircularReplacer()),
        );

        returnData.push({
          json: safeResponse as IDataObject,
          pairedItem: { item: i },
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
          continue;
        }
        if (error instanceof NodeOperationError) {
          throw error;
        }
        throw new NodeApiError(this.getNode(), error as JsonObject, {
          itemIndex: i,
        });
      }
    }

    return [returnData];
  }
}

function stripEmpty(obj: IDataObject): IDataObject {
  const result: IDataObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== "" && value !== null && value !== undefined && value !== 0) {
      result[key] = value;
    }
  }
  return result;
}

function parseJsonField(value: string): IDataObject | undefined {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "{}") return undefined;
  try {
    return JSON.parse(trimmed) as IDataObject;
  } catch {
    return undefined;
  }
}

function getCircularReplacer() {
  const seen = new WeakSet();
  return (_key: string, value: unknown) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return undefined;
      seen.add(value);
    }
    return value;
  };
}
