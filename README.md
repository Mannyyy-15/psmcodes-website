# PSMcodes — Modern Web, App & Digital Engineering

> High-performance digital engineering & digital engineering agency based in Vasai-Virar, Mumbai, Maharashtra, India. Architecting websites, mobile apps, and scalable digital platforms that drive measurable growth.

---

## 🚀 Overview & Architecture

This repository contains the production-ready codebase for **PSMcodes** (`https://psmcodes.in/`), combining ultra-premium design aesthetics, WebGL 3D interactive graphics, Lenis smooth scrolling, kinetic typography, and comprehensive **SEO, GEO (Local Search), AEO (Answer Engine Optimization for AI Search), and Schema.org Structured Data**.

### 📁 Codebase Directory Structure

```text
├── _next/                      # Next.js static asset tree
│   └── static/
│       ├── chunks/             # Code-split JavaScript bundles & Webpack runtime
│       ├── css/                # Optimized Tailwind/PostCSS style bundles
│       └── media/              # High-definition fonts & vector assets
├── banner/                     # Hero section assets (PSMCODES logo, 3D glb models)
├── draco/                      # Google Draco 3D mesh decompression WASM & decoders
├── fonts/                      # TTF & WOFF2 web font assets
├── footer/                     # Footer SVGs and brand marks
├── images/                     # Project thumbnails, previews, and vector icons
├── js/                         # Flattened fallback scripts & runtime modules
├── media/                      # Background video streams & reel footage
├── services/                   # Service videos (Web Dev, Mobile Apps, Full-Stack)
├── showreel/                   # High-res agency showreel MP4
├── work/                       # Portfolio showcase images & hover preview clips
├── index.html                  # Main production HTML with embedded SEO/GEO/AEO schemas
├── package.json                # Project scripts, metadata, and dependencies
├── robots.txt                  # Search engine crawler instructions
├── server.js                   # Zero-dependency Node.js HTTP server (with Range streaming & /api/contact)
├── server.py                   # Zero-dependency Python 3 HTTP Range server alternative
├── sitemap.xml                 # XML sitemap for Google Search Console
└── site.webmanifest            # Progressive Web App (PWA) manifest
```

---

## 🛠️ How to Run Locally

You can run the production site immediately without installing third-party npm packages.

### Option 1: Node.js (Recommended)
```bash
npm start
# or
node server.js
```
- Starts an HTTP server on `http://localhost:3000`
- Features HTTP 206 Partial Content range requests for seamless video streaming
- Features built-in mock `/api/contact` POST handler for modal form submissions

### Option 2: Python 3
```bash
npm run py-start
# or
python server.py
```
- Starts a custom multi-threaded Python server on `http://localhost:3000` with full MIME type and range support.

---

## 🌐 SEO, GEO & AEO Architecture

This project is fully engineered to comply with modern **Google Search Central Guidelines** and **AI Search Engines** (Perplexity, ChatGPT Search, Google Gemini, Copilot).

### 1. GEO Local SEO (Vasai-Virar, Mumbai, Maharashtra)
Meta tags embedded in `<head>`:
```html
<meta name="geo.region" content="IN-MH">
<meta name="geo.placename" content="Virar, Maharashtra, India">
<meta name="geo.position" content="19.4564;72.8091">
<meta name="ICBM" content="19.4564, 72.8091">
```
Targeting key search phrases:
- *Web development company in Vasai-Virar*
- *Website design agency Virar Mumbai*
- *Mobile app developers Mumbai Maharashtra*
- *Best full-stack engineering agency India*

### 2. AEO (Answer Engine Optimization) & Schema.org JSON-LD
The site includes a linked multi-entity `@graph` containing:
- **`ProfessionalService` & `Organization`**: Official business profile, founders, coordinates (`19.4564, 72.8091`), operating hours, contact telephone (`+919022428111`), official email (`psmcodes.co@gmail.com`), price range (`$$`), and service catalog.
- **`WebSite`**: Canonical URL (`https://psmcodes.in/`), search query input schema, and publisher info.
- **`OfferCatalog`**: Structured definitions for:
  - *Custom Web Design & Next.js Development*
  - *iOS & Android Mobile Application Engineering*
  - *Full-Stack Cloud Systems & API Architectures*
- **`FAQPage`**: 6 comprehensive questions & answers formatted specifically for Google Rich Results, featured snippets, and AI crawler citations.

### 3. Google Search Console & Social Verification
- **Google Verification**: `<meta name="google-site-verification" content="4defb266de20b294c8e6cd4752107dfe">`
- **Sitemap**: Discovered automatically at `https://psmcodes.in/sitemap.xml`
- **Robots**: Compliant `robots.txt` disallowing sensitive system paths while allowing full indexing of assets.
- **OpenGraph & Twitter Cards**: High-res preview cards configured for Discord, Slack, WhatsApp, Twitter, and LinkedIn sharing.

---

## 🚢 Deployment Guide

### Deploying to Vercel
1. Push this repository to GitHub or GitLab.
2. Import the project in Vercel.
3. Set Framework Preset to **Other** (Static Site).
4. Deploy!

### Deploying to Netlify
1. Connect the repository to Netlify.
2. Set Build Command: *(leave empty)*
3. Set Publish directory: `.`
4. Deploy!

### Deploying to Nginx / Apache / Custom VPS
Ensure the web server is configured with:
- Gzip/Brotli compression for `.js`, `.css`, and `.svg`.
- Byte-range requests enabled (`Accept-Ranges: bytes`) for the `.mp4` video files.
- MIME type mapping:
  - `.wasm` -> `application/wasm`
  - `.glb`  -> `model/gltf-binary`
  - `.woff2` -> `font/woff2`

---

## 📬 Contact & Brand Information

- **Brand:** PSMcodes
- **Founder / Lead:** Manthan
- **Website:** [https://psmcodes.in](https://psmcodes.in)
- **Email:** `psmcodes.co@gmail.com`
- **Phone / WhatsApp:** `+91 9022428111`
- **Headquarters:** Virar, Maharashtra 401305, India
