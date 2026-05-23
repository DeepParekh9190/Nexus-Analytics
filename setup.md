# Nexus — API Integration Setup Guide

This guide walks you through setting up all 8 API integrations for the Nexus marketing website.

## Prerequisites

- A modern web browser
- Accounts on the services you want to enable (links provided below)
- Basic familiarity with HTML/JavaScript

---

## Table of Contents

1. [Plausible Analytics](#1-plausible-analytics)
2. [GitHub Stars](#2-github-stars)
3. [Formspree (Contact Form)](#3-formspree-contact-form)
4. [EmailJS (Contact + Newsletter)](#4-emailjs-contact--newsletter)
5. [Mailchimp (Newsletter)](#5-mailchimp-newsletter)
6. [Stripe (Pricing / Payments)](#6-stripe-pricing--payments)
7. [Firebase Auth (Login / Signup)](#7-firebase-auth-login--signup)
8. [json-server (API Playground Backend)](#8-json-server-api-playground-backend)

---

## Configuration File

All API keys live in **`config.js`**. Open it and fill in the values for each service you want to use. The site will work normally if a key is missing — no errors, just graceful fallbacks.

```js
window.NEXUS_CONFIG = {

  FORMPREE_ID: '',

  EMAILJS_PUBLIC_KEY: '',
  EMAILJS_SERVICE_ID: '',
  EMAILJS_CONTACT_TEMPLATE: '',
  EMAILJS_NEWSLETTER_TEMPLATE: '',

  PLAUSIBLE_DOMAIN: '',
  GA_MEASUREMENT_ID: '',

  MAILCHIMP_ACTION_URL: '',

  STRIPE_PUBLISHABLE_KEY: '',
  STRIPE_STANDARD_PRICE_ID: '',
  STRIPE_PRO_PRICE_ID: '',

  FIREBASE_API_KEY: '',
  FIREBASE_AUTH_DOMAIN: '',
  FIREBASE_PROJECT_ID: '',
  FIREBASE_APP_ID: '',

  JSON_SERVER_URL: 'http://localhost:3000',

  GITHUB_REPO: 'vercel/next.js'
};
```

---

## 1. Plausible Analytics

**Purpose:** Track site visitors, page views, and referral sources.  
**Cost:** Free tier available (10K page views/month).  
**URL:** https://plausible.io

### Setup

1. Sign up at https://plausible.io
2. Click **"Add website"** → enter your domain (e.g. `nexus.dev`)
3. Plausible gives you a script tag like:
   ```html
   <script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
   ```
4. The script is already embedded on every HTML page. Just update the `data-domain` attribute from `nexus.dev` to your actual domain.

### Alternative: Google Analytics

If you prefer GA4 over Plausible:

1. Go to https://analytics.google.com → create a property → get your Measurement ID (`G-XXXXXXXXXX`)
2. Open `config.js` and set `GA_MEASUREMENT_ID`
3. The Plausible script tag in `<head>` will remain — you can replace it with the GA snippet or keep both.

### Files changed

- All 14 HTML files — `<head>` now includes `plausible.io/js/script.js`

---

## 2. GitHub Stars

**Purpose:** Display real-time star count from a GitHub repository on the Developers page.  
**Cost:** Free (GitHub public API, no key required).  
**URL:** https://github.com

### Setup

1. Open `config.js`
2. Change `GITHUB_REPO` to your actual repo (e.g. `'my-org/my-repo'`)
3. The star count appears on `developers.html` inside the GitHub SDK card

### How it works

```js
fetch('https://api.github.com/repos/vercel/next.js')
  .then(r => r.json())
  .then(data => {
    // Displays count like "123k"
  })
```

### Files changed

- `script.js` — `initGitHubStars()` function (module 1)
- `developers.html` — new SDK card with `id="github-stars"`

---

## 3. Formspree (Contact Form)

**Purpose:** Make the Contact form actually send emails when submitted.  
**Cost:** Free (50 submissions/month).  
**URL:** https://formspree.io

### Setup

1. Sign up at https://formspree.io
2. Click **"Create a form"** → give it a name (e.g. "Nexus Contact")
3. Copy the form ID from the URL — it looks like `xvgpwdak`
4. Open `contact.html` and find:
   ```html
   <form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
5. Replace `YOUR_FORM_ID` with your actual form ID
6. (Optional) In Formspree dashboard, set up email notifications

### How it works

Formspree uses a standard HTML form POST. No JavaScript needed. When the user submits, Formspree captures the data and emails you.

### Files changed

- `contact.html` — form now has `action`, `method`, and `name` attributes on inputs
- `config.js` — `FORMPREE_ID` placeholder

---

## 4. EmailJS (Contact + Newsletter)

**Purpose:** Send emails from the contact form and newsletter subscribe forms via JavaScript.  
**Cost:** Free (200 emails/month).  
**URL:** https://www.emailjs.com

### Setup

#### Step 1: Create an Email Service

1. Sign up at https://www.emailjs.com
2. Go to **Email Services** → **Add New Service**
3. Choose a provider (Gmail, Outlook, or any SMTP)
4. Copy the **Service ID** (looks like `service_abc123`)

#### Step 2: Create Templates

**Contact Template:**

1. Go to **Email Templates** → **Create New Template**
2. Design with these variables:
   - `{{name}}` — sender's name
   - `{{email}}` — sender's email
   - `{{company}}` — sender's company
   - `{{message}}` — the message body
3. Save and copy the **Template ID** (looks like `template_contact`)

**Newsletter Template:**

1. Create another template with just `{{email}}`
2. Save and copy the **Template ID** (looks like `template_newsletter`)

#### Step 3: Get API Key

1. Go to **Account** → **API Keys**
2. Copy your **Public Key** (starts with `user_...`)

#### Step 4: Configure

In `config.js`, fill in:

```js
EMAILJS_PUBLIC_KEY: 'user_YOUR_KEY',
EMAILJS_SERVICE_ID: 'service_abc123',
EMAILJS_CONTACT_TEMPLATE: 'template_contact',
EMAILJS_NEWSLETTER_TEMPLATE: 'template_newsletter',
```

### How it works

The SDK is loaded dynamically from CDN (no script tag needed in HTML). When a form is submitted, EmailJS sends the data via your configured email service.

```js
emailjs.send(SERVICE_ID, TEMPLATE_ID, { name, email, message })
  .then(() => showSuccess())
  .catch(() => showError());
```

### Files changed

- `script.js` — `initEmailJS()` and `attachEmailJSHandlers()` (module 2)
- `config.js` — EmailJS config values

---

## 5. Mailchimp (Newsletter)

**Purpose:** Add newsletter subscribers to a Mailchimp audience.  
**Cost:** Free (500 contacts/month).  
**URL:** https://mailchimp.com

### Setup

1. Sign up at https://mailchimp.com
2. Create an **Audience** (list)
3. Go to **Audience** → **Signup Forms** → **Embedded Forms**
4. Copy the form action URL. It looks like:
   ```
   https://nexus.us1.list-manage.com/subscribe/post?u=xxx&id=yyy
   ```
5. In `config.js`, paste into `MAILCHIMP_ACTION_URL`

### How it works

The newsletter forms in the footer and modal will now POST directly to Mailchimp when submitted.

### Important

Mailchimp's embedded form opens in a new tab by default (`target="_blank"`). If you want an inline experience, use EmailJS instead (integration #4).

### Files changed

- `script.js` — `initMailchimp()` (module 3)
- `config.js` — `MAILCHIMP_ACTION_URL`

---

## 6. Stripe (Pricing / Payments)

**Purpose:** Let users purchase a plan from the Pricing page.  
**Cost:** Free to set up (per-transaction fees).  
**URL:** https://dashboard.stripe.com

### Setup

#### Step 1: Create Products

1. Go to https://dashboard.stripe.com → **Products** → **Add Product**
2. Create **Standard Plan** ($0/month):
   - Name: "Standard"
   - Pricing: Recurring → $0.00/month
   - Click "Save"
3. Create **Professional Plan** ($49/month):
   - Name: "Professional"
   - Pricing: Recurring → $49.00/month
   - Click "Save"

#### Step 2: Copy Price IDs

1. In Stripe Dashboard → **Products**
2. Click on each product
3. Copy the **Price ID** (looks like `price_abc123`)
4. In `config.js`:
   ```js
   STRIPE_STANDARD_PRICE_ID: 'price_abc123',
   STRIPE_PRO_PRICE_ID: 'price_def456',
   ```

#### Step 3: Get Publishable Key

1. Stripe Dashboard → **Developers** → **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. In `config.js`:
   ```js
   STRIPE_PUBLISHABLE_KEY: 'pk_test_...'
   ```

#### Step 4: Wire Up Price IDs to Buttons

Open `pricing.html` and find:

```html
<a href="#" class="btn btn-secondary full-width stripe-buy" data-price-id="">Get started</a>
```

and

```html
<a href="#" class="btn btn-primary full-width stripe-buy" data-price-id="">Start free trial</a>
```

Fill in the `data-price-id` attributes with the corresponding Price IDs.

### How it works

Stripe Checkout opens a secure payment page hosted by Stripe. No card data touches your server.

```js
stripe.redirectToCheckout({
  lineItems: [{ price: priceId, quantity: 1 }],
  mode: 'subscription',
  successUrl: '/pricing.html?success=true',
  cancelUrl: '/pricing.html?canceled=true'
});
```

### Files changed

- `pricing.html` — Stripe.js SDK loaded, `stripe-buy` class on buttons
- `script.js` — `initStripe()` (module 4)
- `config.js` — Stripe config values

---

## 7. Firebase Auth (Login / Signup)

**Purpose:** Replace localStorage-based auth with real email/password + OAuth (GitHub + Google).  
**Cost:** Free tier (10K users/month).  
**URL:** https://console.firebase.google.com

### Setup

#### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **Create a project** → follow the wizard
3. Once created, click the **Web** icon (`</>`) to register a web app
4. Give it a nickname (e.g. "Nexus")
5. Copy the **Firebase config object**:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "nexus.firebaseapp.com",
  projectId: "nexus-12345",
  appId: "1:12345:web:abc...",
};
```

6. In `config.js`, fill in all 4 values

#### Step 2: Enable Sign-in Methods

1. Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **GitHub** → follow the instructions to register an OAuth app
4. Enable **Google** → enable the toggle
5. (Optional) Add your domain to **Authorized domains**

#### Step 3: Test

- Open `login.html` → sign in with email/password
- Click the GitHub or Google buttons → OAuth popup flow

### How it works

When Firebase Auth is configured:

1. Email/password signup/login goes through Firebase instead of localStorage
2. OAuth popups let users sign in with GitHub or Google
3. On success, Firebase sets a local session that persists across page reloads
4. The existing `Auth` object (for navbar display) is kept — Firebase updates it

```js
auth.signInWithEmailAndPassword(email, password)
auth.createUserWithEmailAndPassword(email, password)
  .then(result => result.user.updateProfile({ displayName: name }))
new firebase.auth.GithubAuthProvider()
new firebase.auth.GoogleAuthProvider()
```

### Fallback

If Firebase keys are empty, the old localStorage auth system still works.

### Files changed

- `login.html` — Firebase SDK loaded, OAuth buttons added
- `signup.html` — Firebase SDK loaded, OAuth buttons added
- `styles.css` — OAuth button styles
- `script.js` — `initFirebaseAuth()` (module 5)
- `config.js` — Firebase config values

---

## 8. json-server (API Playground Backend)

**Purpose:** Give the API Playground on `docs.html` a real backend instead of simulated responses.  
**Cost:** Free (local development).  
**URL:** https://github.com/typicode/json-server

### Setup

#### Step 1: Install json-server

```bash
npm install -g json-server
```

#### Step 2: Start the server

```bash
cd E:\website
json-server --watch db.json --port 3000
```

You should see:
```
  JSON Server started on PORT :3000
  Resources:
    http://localhost:3000/events
    http://localhost:3000/identify
```

#### Step 3: Configure

In `config.js`, the default URL is:

```js
JSON_SERVER_URL: 'http://localhost:3000'
```

No changes needed if you use port 3000.

#### Step 4: Test

1. Start json-server
2. Open `docs.html`
3. Go to the API Playground section
4. Click **"Send request"** — it will POST to `http://localhost:3000/events`
5. The response will show the saved data from `db.json`

### How it works

When `JSON_SERVER_URL` is set, the playground sends real `fetch()` POST requests instead of simulated timeouts.

```js
fetch('http://localhost:3000/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ event: "Button Clicked", userId: "usr_12345", ... })
}).then(r => r.json())
  .then(data => showResponse(data));
```

### db.json structure

```json
{
  "events": [
    {
      "id": "evt_001",
      "event": "Button Clicked",
      "userId": "usr_12345",
      "properties": { "button": "signup_cta", "page": "/pricing" }
    }
  ],
  "identify": [
    {
      "id": "usr_12345",
      "traits": { "name": "Jane Smith", "email": "jane@acme.com" }
    }
  ]
}
```

### Files changed

- `script.js` — `initJsonServerPlayground()` (module 6)
- `config.js` — `JSON_SERVER_URL`
- `db.json` — created (new file)

---

## Testing

After configuring each integration, test individually:

| Integration | How to Test |
|-------------|-------------|
| Plausible | Visit site → open Plausible dashboard → check for pageview |
| GitHub Stars | Open `developers.html` → see star count load |
| Formspree | Submit contact form → check email |
| EmailJS | Submit contact/newsletter → check email |
| Mailchimp | Subscribe → check Mailchimp audience |
| Stripe | Click "Start free trial" → Stripe Checkout should open |
| Firebase Auth | Sign up, sign in, try GitHub/Google OAuth |
| json-server | Click "Send request" in playground → see real response |

---

## Troubleshooting

### "Nothing happens when I click submit"

- Open browser console (F12) → check for JavaScript errors
- Verify the config value is filled in, not empty
- Check that the CDN script loaded (Network tab)

### "Formspree returned an error"

- Make sure the form ID is correct in the `action` URL
- Formspree requires a valid email field with `name="email"`

### "Stripe Checkout didn't open"

- Make sure `STRIPE_PUBLISHABLE_KEY` is set correctly
- Check that `data-price-id` contains a valid Stripe Price ID
- Stripe Checkout requires HTTPS in production

### "Firebase OAuth popup was blocked"

- Allow popups for your site in the browser
- Make sure the OAuth provider is enabled in Firebase Console
- Add your domain to Firebase Authorized domains

### "json-server not running"

- Run `json-server --watch db.json --port 3000` in the project directory
- Check that port 3000 is not in use (`netstat -ano | findstr :3000`)
- Try a different port: `--port 3001` and update `config.js`

---

## File Reference

| File | Purpose |
|------|---------|
| `config.js` | Central API key configuration |
| `script.js` | All integration logic (7 modules) |
| `db.json` | json-server data file |
| `contact.html` | Formspree action + form fields |
| `developers.html` | GitHub stars card |
| `pricing.html` | Stripe buy buttons + JS SDK |
| `login.html` | Firebase Auth + OAuth buttons |
| `signup.html` | Firebase Auth + OAuth buttons |
| `styles.css` | OAuth button styles |
| All HTML files | Plausible analytics script + config.js loaded |
