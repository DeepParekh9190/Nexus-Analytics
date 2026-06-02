# ⚡ Nexus Analytics — Developer-First Analytics Platform

Welcome to the official repository for the **Nexus Marketing Website**. Nexus is a modern, minimalist, developer-first analytics platform. This repository hosts the complete front-end experience, complete with simulated services, interactive widgets, local authentication, dashboard analytics, and 8 production-ready API integrations.

---

## 📖 Table of Contents

1. [🚀 Overview](#-overview)
2. [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
3. [✨ Key Features](#-key-features)
4. [📂 Directory Structure](#-directory-structure)
5. [🔌 Production API Integrations](#-production-api-integrations)
6. [💻 Getting Started Locally](#-getting-started-locally)
7. [🎨 Design & Layout Specs](#-design--layout-specs)
8. [📈 SEO & Performance Optimization](#-seo--performance-optimization)

---

## 🚀 Overview

Nexus is designed to serve as a high-fidelity marketing site. The application simulates the complex functionalities of a modern software-as-a-service (SaaS) platform, including:
- Dynamic authentication workflows.
- An interactive live demo metrics dashboard.
- A functional documentation center with an interactive API playground.
- Responsive menu systems and smooth animation frameworks.

---

## 🛠️ Tech Stack & Architecture

This project is built using vanilla technologies to ensure zero-dependency page load speeds and maximum compatibility:

*   **HTML5**: Clean semantic structures across 13 unique pages.
*   **CSS3**: A unified [styles.css](file:///e:/website/styles.css) design system leveraging HSL design variables (Stripe/Vercel-inspired aesthetic).
*   **Vanilla JavaScript**: Lightweight modules in [script.js](file:///e:/website/script.js) managing interactive features, state, and API layers.
*   **Chart.js**: Rendered via CDN on the [live demo](file:///e:/website/demo.html) page.
*   **Fonts**: *Inter* (sans-serif) and *Outfit* (display) loaded dynamically via Google Fonts.

---

## ✨ Key Features

*   **🔒 Simulated & Firebase Auth**: Features a localStorage-based auth framework with registration validation, session retention, auto-login, and full integration capability with Firebase Authentication (including Google and GitHub OAuth popups).
*   **💬 Support Chat Widget**: A sticky bottom-right chat bubble on every page offering responsive, simulated auto-reply messages from Nexus Support.
*   **📬 Delayed Newsletter Modal**: A conversion-focused modal that triggers after 15 seconds of page interaction, storing a dismiss state in `localStorage` to avoid re-prompting users.
*   **🎛️ Interactive Pricing Calculator**: A custom range-slider (from 1K to 10M events/month) that dynamically recommends the optimal pricing tier.
*   **📊 Live Mockup Dashboard**: Built on Chart.js, presenting real-time user growth, traffic metrics, page visits, and organic vs. referral pipelines.
*   **🧪 API Playground Docs**: A documentation playground on the [Documentation](file:///e:/website/docs.html) page, allowing developers to customize mock payloads and send requests to simulated backends or local databases.
*   **🟢 System Uptime Status**: A dedicated [Status page](file:///e:/website/status.html) featuring a 90-day operational grid system, partial/full downtime simulation, and recent incident logs.

---

## 📂 Directory Structure

```plaintext
E:\website\
├── index.html              # Homepage with hero, testimonials, and features intro
├── features.html           # Core analytics feature showcase
├── pricing.html            # Plans, FAQs, and interactive billing slider
├── developers.html         # Developer SDK cards and CLI snippet
├── docs.html               # Guides and interactive API payload runner
├── demo.html               # Live Chart.js analytics dashboard
├── blog.html               # Insights blog with categories and search indexing
├── contact.html            # Sales inquiry form with inline validation
├── status.html             # Real-time incident logs and 90-day uptime chart
├── login.html              # Sign In gateway
├── signup.html             # Account registration page
├── forgot-password.html    # Password reset simulation
├── privacy.html            # GDPR/CCPA privacy policy documentation
├── terms.html              # Terms of Service agreement
├── styles.css              # Universal design system CSS sheet
├── script.js               # App logic, client modules, and API loaders
├── config.js               # API credentials and settings config
├── sitemap.xml             # Search engine sitemap
├── robots.txt              # Search engine crawler policies
└── images/                 # Mockup image repository (dashboard, data flow, etc.)
```

---

## 🔌 Production API Integrations

The codebase is built to support plug-and-play connections to external services. By filling in values in [config.js](file:///e:/website/config.js), these modules activate instantly with graceful fallbacks:

| Integration | File & Module | Purpose |
| :--- | :--- | :--- |
| **Plausible Analytics** | `<head>` scripts | Privacy-friendly page-view tracking |
| **GitHub REST API** | [script.js](file:///e:/website/script.js) (Module 1) | Live star-count rendering inside the Developers SDK card |
| **Formspree** | [contact.html](file:///e:/website/contact.html) form action | Real emails on sales contact submissions |
| **EmailJS** | [script.js](file:///e:/website/script.js) (Module 2) | JavaScript contact and newsletter subscriptions |
| **Mailchimp** | [script.js](file:///e:/website/script.js) (Module 3) | Direct signup mapping to Mailchimp subscriber lists |
| **Stripe Checkout** | [script.js](file:///e:/website/script.js) (Module 4) | Subscription purchasing via Stripe Hosted checkout |
| **Firebase Auth** | [script.js](file:///e:/website/script.js) (Module 5) | Production login/signup with Email or Google/GitHub popups |
| **json-server** | [script.js](file:///e:/website/script.js) (Module 6) | Real database tracking for the API Playground |

---

## 💻 Getting Started Locally

### 1. Running the site
Since the project is a static site, you can run it using any simple local server:

**Using Python:**
```bash
python -m http.server 8000
```
**Using Node (http-server):**
```bash
npx http-server -p 8000
```
Open `http://localhost:8000` in your web browser.

### 2. Running the API Playground Local Database
To write real API requests sent from the playground on the Docs page:
1. Install Typicode's `json-server` globally or run it via npx:
   ```bash
   npx json-server --watch db.json --port 3000
   ```
2. Enable `JSON_SERVER_URL` in [config.js](file:///e:/website/config.js):
   ```javascript
   JSON_SERVER_URL: 'http://localhost:3000'
   ```
Requests from the Docs page will now write events directly to your local [db.json](file:///e:/website/db.json) file.

---

## 🎨 Design & Layout Specs

*   **Responsive Layout Grid**: Powered by a CSS grid-based responsive system that snaps cleanly across breakpoints (`1200px` desktop / `992px` tablet / `768px` mobile / `480px` mobile-small).
*   **Staggered Mobile Nav Menu**: Uses CSS Grid positioning inside the navbar when open. It features a custom staggered slide-down transition (`slideDownFade` keyframes) and animated hamburger toggle button spans.
*   **Micro-interactions**: Hover transforms on anchors, buttons, and testimonials dot controls, with reduced motion preferences honored automatically for accessibility.

---

## 📈 SEO & Performance Optimization

*   **Search Engine Optimization**: Fully indexed with proper header tags (`h1`-`h4` hierarchies), custom descriptions on each page, descriptive image alt properties, a valid `robots.txt`, and a structured `sitemap.xml`.
*   **Performance Loading**: Employs `loading="lazy"` attributes on mockups and image assets to minimize paint latency on entry.
