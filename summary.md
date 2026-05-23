# Nexus Analytics — Marketing Website

## Overview

A static marketing website for **Nexus**, a fictional developer-first analytics platform. Features a full marketing site with authentication simulation, interactive demo dashboard, live chat widget, pricing calculator, blog, API playground, status page, legal pages, and newsletter modal.

## Tech Stack

- **HTML5** — 13 pages
- **CSS3** — Single `styles.css` with custom properties design system
- **JavaScript** — Vanilla JS with Chart.js (CDN) on demo page
- **Fonts** — Inter + Outfit via Google Fonts
- **Images** — 2 PNG mockups (`dashboard.png`, `data.png`)

## Pages

| Page | Route | Content |
|---|---|---|
| **Home** | `index.html` | Hero, social proof, testimonials carousel, newsletter, scroll animations |
| **Features** | `features.html` | Data flow visualization spotlight, 4 feature cards |
| **Pricing** | `pricing.html` | Two-tier pricing + interactive slider calculator + billing FAQ |
| **Developers** | `developers.html` | 4 SDK cards (Node.js, React, Python, Go), code snippet, uptime indicator |
| **Documentation** | `docs.html` | Quickstart guide + interactive API playground (try endpoints in-browser) |
| **Live Demo** | `demo.html` | Chart.js dashboard: events line chart, user growth, traffic doughnut, top pages bar |
| **Blog** | `blog.html` | 6 article cards with categories, pagination |
| **Contact** | `contact.html` | Sales contact form with validation + company info sidebar |
| **Status** | `status.html` | All Systems Operational, 90-day uptime grid, recent incidents |
| **Sign In** | `login.html` | Email/password form, forgot password link |
| **Sign Up** | `signup.html` | Registration with validation, duplicate-email check, auto-login |
| **Reset Password** | `forgot-password.html` | Email form with "Check your inbox" success state |
| **Privacy** | `privacy.html` | Full privacy policy with 9 sections |
| **Terms** | `terms.html` | Terms of service with 9 sections |

## Features

- **Auth system** — localStorage-based signup/login/logout with session persistence, conditional navbar (guest avatar dropdown)
- **Live chat widget** — Fixed bottom-right bubble on every page, auto-reply bot messages
- **Newsletter modal** — 15s delayed popup with dismiss persistence (localStorage)
- **API playground** — Tabbed interface on docs page with JSON editor, send/reset, simulated responses
- **Scroll animations** — IntersectionObserver fade-in + slide-up on all pages
- **Testimonials carousel** — Auto-rotating (5s) customer quotes with dot/prev/next navigation
- **Pricing calculator** — Range slider (1K–10M events) with plan recommendation
- **Pagination** — Blog page with page buttons (1, 2, 3)
- **Status page** — Uptime bars + incident timeline
- **SEO** — `sitemap.xml`, `robots.txt`, meta descriptions, font preconnect, lazy-load images

## Design

- Minimalist, Stripe/Vercel-inspired, orange (#f97316) accent
- Sticky navbar with scroll blur, gradient highlights, responsive breakpoints (992px / 768px / 480px)

## Structure

```
E:\website\
├── index.html              # Landing + testimonials
├── features.html           # Features page
├── pricing.html            # Pricing + calculator
├── developers.html         # SDK page
├── docs.html               # Docs + API playground
├── demo.html               # Chart.js dashboard
├── blog.html               # Blog with pagination
├── contact.html            # Contact/sales form
├── status.html             # System status + uptime
├── login.html              # Sign in
├── signup.html             # Sign up
├── forgot-password.html    # Password reset
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── styles.css              # Global stylesheet
├── script.js               # All JavaScript
├── sitemap.xml             # SEO sitemap
├── robots.txt              # SEO robots
└── images\
    ├── dashboard.png
    └── data.png
```
