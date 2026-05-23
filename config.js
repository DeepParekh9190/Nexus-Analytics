// ═══════════════════════════════════════════════
//  Nexus — API Configuration
//  Fill in your keys below to enable integrations
// ═══════════════════════════════════════════════

window.NEXUS_CONFIG = {

  // ─── 1. Formspree (Contact Form) ───
  // Sign up at https://formspree.io → create a form → paste the ID
  FORMPREE_ID: 'xpqnlpzl',  // e.g. 'xvgpwdak'

  // ─── 2. EmailJS (Contact Form + Newsletter) ───
  // Sign up at https://www.emailjs.com → create service, template, get keys
  EMAILJS_PUBLIC_KEY: '',     // e.g. 'YOUR_PUBLIC_KEY'
  EMAILJS_SERVICE_ID: 'service_95hn0wl',     // e.g. 'service_abc123'
  EMAILJS_CONTACT_TEMPLATE: 'template_kbaiidl', // e.g. 'template_contact'
  EMAILJS_NEWSLETTER_TEMPLATE: 'template_kbaiidl', // e.g. 'template_newsletter'

  // ─── 3. Plausible Analytics ───
  // Sign up at https://plausible.io → add your site → get script URL
  PLAUSIBLE_DOMAIN: '',  // e.g. 'nexus.dev'
  // OR use Google Analytics instead (leave PLAUSIBLE_DOMAIN empty)
  GA_MEASUREMENT_ID: '', // e.g. 'G-XXXXXXXXXX'

  // ─── 4. Mailchimp Newsletter ───
  // Sign up at Mailchimp → build a form → get the action URL
  MAILCHIMP_ACTION_URL: '', // e.g. 'https://nexus.us1.list-manage.com/subscribe/post?u=xxx&id=yyy'

  // ─── 5. Stripe (Pricing) ───
  // Sign up at https://stripe.com → create products → get price IDs
  STRIPE_PUBLISHABLE_KEY: '', // e.g. 'pk_test_...'
  STRIPE_STANDARD_PRICE_ID: '', // e.g. 'price_abc123'
  STRIPE_PRO_PRICE_ID: '',     // e.g. 'price_def456'

  // ─── 6. Firebase Auth (Login / Signup) ───
  // Go to Firebase Console → create project → web app → copy config
  FIREBASE_API_KEY: '',
  FIREBASE_AUTH_DOMAIN: '',
  FIREBASE_PROJECT_ID: '',
  FIREBASE_APP_ID: '',

  // ─── 7. json-server (API Playground) ───
  JSON_SERVER_URL: '', // empty to use simulated responses in production

  // ─── 8. GitHub Repo (for stars on developers page) ───
  GITHUB_REPO: 'vercel/next.js' // change to any repo

};
