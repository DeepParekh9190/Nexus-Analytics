// ═══════════════════════════════════════════════
//  API Integration Modules
// ═══════════════════════════════════════════════

const cfg = window.NEXUS_CONFIG || {};

// ─── Module 1: GitHub Stars ───
function initGitHubStars() {
  const container = document.getElementById('github-stars');
  if (!container || !cfg.GITHUB_REPO) return;
  fetch(`https://api.github.com/repos/${cfg.GITHUB_REPO}`)
    .then(r => r.json())
    .then(data => {
      if (data.stargazers_count !== undefined) {
        const n = data.stargazers_count;
        container.textContent = n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : n;
      }
    })
    .catch(() => { container.textContent = '—'; });
}

// ─── Module 2: EmailJS ───
function initEmailJS() {
  if (!cfg.EMAILJS_PUBLIC_KEY) return;
  if (!window.emailjs) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => { emailjs.init(cfg.EMAILJS_PUBLIC_KEY); attachEmailJSHandlers(); };
    document.head.appendChild(s);
    return;
  }
  emailjs.init(cfg.EMAILJS_PUBLIC_KEY);
  attachEmailJSHandlers();
}

function attachEmailJSHandlers() {

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const company = document.getElementById('contact-company').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      const errorEl = document.getElementById('contact-error');
      const successEl = document.getElementById('contact-success');
      errorEl.textContent = '';
      successEl.textContent = '';
      if (!name || !email || !message) { errorEl.textContent = 'Please fill in required fields.'; return; }
      emailjs.send(cfg.EMAILJS_SERVICE_ID, cfg.EMAILJS_CONTACT_TEMPLATE, { name, email, company, message })
        .then(() => { successEl.textContent = 'Thanks for reaching out! We\'ll get back to you within 24 hours.'; contactForm.reset(); })
        .catch(() => { errorEl.textContent = 'Failed to send. Please try again later.'; });
    });
  }

  // Newsletter forms
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input.value.trim();
      if (!email) return;
      emailjs.send(cfg.EMAILJS_SERVICE_ID, cfg.EMAILJS_NEWSLETTER_TEMPLATE, { email })
        .then(() => { input.value = ''; })
        .catch(() => {});
    });
  });
}

// ─── Module 3: Mailchimp ───
function initMailchimp() {
  if (!cfg.MAILCHIMP_ACTION_URL) return;
  document.querySelectorAll('.newsletter-form').forEach(form => {
    if (!form.dataset.mailchimp) {
      form.dataset.mailchimp = '1';
      form.action = cfg.MAILCHIMP_ACTION_URL;
      form.method = 'POST';
      form.target = '_blank';
    }
  });
}

// ─── Module 4: Stripe ───
function initStripe() {
  if (!cfg.STRIPE_PUBLISHABLE_KEY || !window.Stripe) return;
  const stripe = Stripe(cfg.STRIPE_PUBLISHABLE_KEY);

  document.querySelectorAll('.stripe-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const priceId = btn.dataset.priceId;
      if (!priceId) return;
      stripe.redirectToCheckout({ lineItems: [{ price: priceId, quantity: 1 }], mode: 'subscription', successUrl: window.location.origin + '/pricing.html?success=true', cancelUrl: window.location.origin + '/pricing.html?canceled=true' });
    });
  });
}

// ─── Module 5: Firebase Auth ───
function initFirebaseAuth() {
  if (!cfg.FIREBASE_API_KEY || !window.firebase) return;
  const app = firebase.initializeApp({ apiKey: cfg.FIREBASE_API_KEY, authDomain: cfg.FIREBASE_AUTH_DOMAIN, projectId: cfg.FIREBASE_PROJECT_ID, appId: cfg.FIREBASE_APP_ID });
  const auth = firebase.auth();

  auth.onAuthStateChanged(user => {
    if (user) {
      localStorage.setItem('nexus_auth', JSON.stringify({ user: { name: user.displayName || user.email, email: user.email }, token: 'firebase_' + user.uid }));
      Auth.updateNavbar();
    }
  });

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');
      errorEl.textContent = '';
      if (!email || !password) { errorEl.textContent = 'Please fill in all fields.'; return; }
      auth.signInWithEmailAndPassword(email, password)
        .then(() => window.location.href = 'index.html')
        .catch(err => errorEl.textContent = err.message);
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirm = document.getElementById('signup-confirm').value;
      const errorEl = document.getElementById('signup-error');
      errorEl.textContent = '';
      if (!name || !email || !password || !confirm) { errorEl.textContent = 'Please fill in all fields.'; return; }
      if (password.length < 8) { errorEl.textContent = 'Password must be at least 8 characters.'; return; }
      if (password !== confirm) { errorEl.textContent = 'Passwords do not match.'; return; }
      auth.createUserWithEmailAndPassword(email, password)
        .then(result => result.user.updateProfile({ displayName: name }).then(() => window.location.href = 'index.html'))
        .catch(err => errorEl.textContent = err.message);
    });
  }

  // GitHub OAuth button
  const githubBtn = document.getElementById('github-oauth');
  if (githubBtn) {
    githubBtn.addEventListener('click', () => {
      const provider = new firebase.auth.GithubAuthProvider();
      auth.signInWithPopup(provider).then(() => window.location.href = 'index.html');
    });
  }

  // Google OAuth button
  const googleBtn = document.getElementById('google-oauth');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).then(() => window.location.href = 'index.html');
    });
  }
}

// ─── Module 6: json-server (API Playground) ───
function initJsonServerPlayground() {
  if (!cfg.JSON_SERVER_URL) return;
  document.querySelectorAll('.playground-send').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.playground-panel');
      const textarea = panel.querySelector('textarea');
      const responseEl = panel.querySelector('.playground-response');
      const body = textarea.value.trim();
      if (!body) { responseEl.textContent = 'Error: Request body is empty.'; responseEl.className = 'playground-response error'; return; }
      responseEl.textContent = 'Sending request...';
      responseEl.className = 'playground-response';
      const endpoint = panel.id === 'playground-track' ? '/events' : '/identify';
      fetch(cfg.JSON_SERVER_URL + endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
        .then(r => r.json())
        .then(data => { responseEl.textContent = JSON.stringify({ status: 'ok', data }, null, 2); responseEl.className = 'playground-response success'; })
        .catch(() => { responseEl.textContent = JSON.stringify({ status: 'ok', message: 'Event tracked successfully (simulated).', id: 'evt_' + Math.random().toString(36).slice(2, 10) }, null, 2); responseEl.className = 'playground-response success'; });
    });
  });
}

// ─── Module 7: Newsletter fallback (local) ───
function initNewsletterFallback() {
  // If no EmailJS or Mailchimp configured, just clear the field
  if (cfg.EMAILJS_PUBLIC_KEY || cfg.MAILCHIMP_ACTION_URL) return;
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        input.value = '';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {

    // ───── Mobile Menu Toggle ─────
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');

    if (mobileBtn && navbar) {
        mobileBtn.addEventListener('click', () => {
            navbar.classList.toggle('nav-open');
        });
    }

    // ───── Navbar Scroll Effect ─────
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ───── Reset Mobile Styles on Resize ─────
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navbar) {
            navbar.classList.remove('nav-open');
        }
    });

    // ───── Auth System ─────
    const Auth = {
        key: 'nexus_auth',
        usersKey: 'nexus_users',
        getSession() {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : null;
        },
        getUser() {
            const session = this.getSession();
            return session ? session.user : null;
        },
        isLoggedIn() { return !!this.getSession(); },
        getUsers() {
            const data = localStorage.getItem(this.usersKey);
            return data ? JSON.parse(data) : [];
        },
        saveUsers(users) {
            localStorage.setItem(this.usersKey, JSON.stringify(users));
        },
        signup(name, email, password) {
            const users = this.getUsers();
            if (users.find(u => u.email === email)) return { success: false, error: 'An account with this email already exists.' };
            users.push({ name, email, password });
            this.saveUsers(users);
            this.login(email, password);
            return { success: true };
        },
        login(email, password) {
            const users = this.getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) return { success: false, error: 'Invalid email or password.' };
            localStorage.setItem(this.key, JSON.stringify({ user: { name: user.name, email: user.email }, token: 'nexus_jwt_' + Date.now() }));
            return { success: true };
        },
        logout() {
            localStorage.removeItem(this.key);
            window.location.reload();
        },
        updateNavbar() {
            const guestSection = document.querySelector('.auth-guest');
            const userSection = document.querySelector('.auth-user');
            const avatarEl = document.getElementById('user-avatar');
            if (!guestSection || !userSection) return;
            if (this.isLoggedIn()) {
                guestSection.style.display = 'none';
                userSection.style.display = 'block';
                const user = this.getUser();
                if (avatarEl && user) avatarEl.textContent = user.name.charAt(0).toUpperCase();
            } else {
                guestSection.style.display = '';
                userSection.style.display = 'none';
            }
        }
    };

    Auth.updateNavbar();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => { e.preventDefault(); Auth.logout(); });
    }

    const userAvatar = document.getElementById('user-avatar');
    const userDropdown = document.getElementById('user-dropdown');
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', () => userDropdown.classList.toggle('show'));
        document.addEventListener('click', (e) => { if (!userAvatar.contains(e.target)) userDropdown.classList.remove('show'); });
    }

    // ───── Login Form ─────
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const errorEl = document.getElementById('login-error');
            errorEl.textContent = '';
            if (!email || !password) { errorEl.textContent = 'Please fill in all fields.'; return; }
            const result = Auth.login(email, password);
            if (result.success) window.location.href = 'index.html';
            else errorEl.textContent = result.error;
        });
    }

    // ───── Signup Form ─────
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;
            const errorEl = document.getElementById('signup-error');
            errorEl.textContent = '';
            if (!name || !email || !password || !confirm) { errorEl.textContent = 'Please fill in all fields.'; return; }
            if (password.length < 8) { errorEl.textContent = 'Password must be at least 8 characters.'; return; }
            if (password !== confirm) { errorEl.textContent = 'Passwords do not match.'; return; }
            const result = Auth.signup(name, email, password);
            if (result.success) window.location.href = 'index.html';
            else errorEl.textContent = result.error;
        });
    }

    // ───── Forgot Password ─────
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value.trim();
            const errorEl = document.getElementById('forgot-error');
            errorEl.textContent = '';
            if (!email) { errorEl.textContent = 'Please enter your email address.'; return; }
            forgotForm.style.display = 'none';
            document.getElementById('forgot-success').style.display = 'block';
        });
    }

    // ───── Contact Form (fallback when no EmailJS and no Formspree) ─────
    if (!cfg.EMAILJS_PUBLIC_KEY && !cfg.FORMPREE_ID) {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('contact-name').value.trim();
                const email = document.getElementById('contact-email').value.trim();
                const message = document.getElementById('contact-message').value.trim();
                const errorEl = document.getElementById('contact-error');
                const successEl = document.getElementById('contact-success');
                errorEl.textContent = '';
                successEl.textContent = '';
                if (!name || !email || !message) { errorEl.textContent = 'Please fill in required fields.'; return; }
                successEl.textContent = 'Thanks for reaching out! We\'ll get back to you within 24 hours.';
                contactForm.reset();
            });
        }
    }

    // ───── Scroll Animations ─────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ───── Testimonials Carousel ─────
    const track = document.querySelector('.testimonials-track');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    let currentIndex = 0;
    let autoInterval;

    function goToSlide(index) {
        if (!track) return;
        const total = track.children.length;
        currentIndex = (index + total) % total;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    function startAutoPlay() { stopAutoPlay(); autoInterval = setInterval(() => goToSlide(currentIndex + 1), 5000); }
    function stopAutoPlay() { clearInterval(autoInterval); }

    if (track) {
        goToSlide(0); startAutoPlay();
        if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); startAutoPlay(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); startAutoPlay(); });
        dots.forEach((dot, i) => { dot.addEventListener('click', () => { goToSlide(i); startAutoPlay(); }); });
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
    }

    // ───── Pricing Calculator ─────
    const calcSlider = document.getElementById('calc-slider');
    const calcDisplay = document.getElementById('calc-display');
    const calcStandard = document.getElementById('calc-standard');
    const calcPro = document.getElementById('calc-pro');
    if (calcSlider) {
        function formatEvents(val) {
            if (val >= 1000000) return (val / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
            return val.toString();
        }
        function updatePricing(val) {
            calcDisplay.textContent = formatEvents(val) + ' events/mo';
            calcStandard.classList.remove('recommended');
            calcPro.classList.remove('recommended');
            calcStandard.classList.toggle('recommended', val <= 10000);
            calcPro.classList.toggle('recommended', val > 10000);
        }
        calcSlider.addEventListener('input', () => updatePricing(calcSlider.value));
        updatePricing(calcSlider.value);
    }

    // ───── Demo Dashboard Charts ─────
    if (typeof Chart !== 'undefined') {
        const ctx1 = document.getElementById('chart-events');
        if (ctx1) {
            const days = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: days,
                    datasets: [{ label: 'Events', data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 8000) + 2000), borderColor: '#f97316', backgroundColor: 'rgba(249, 115, 22, 0.08)', fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 7, color: '#9ca3af' } }, y: { grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af' } } } }
            });
        }
        const ctx2 = document.getElementById('chart-users');
        if (ctx2) {
            new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{ label: 'Active Users', data: [1200, 1900, 2800, 3500, 4200, 5800, 7200, 8900, 10500, 12400, 14800, 16200], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#9ca3af' } }, y: { grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af' } } } }
            });
        }
        const ctx3 = document.getElementById('chart-sources');
        if (ctx3) {
            new Chart(ctx3, {
                type: 'doughnut',
                data: { labels: ['Organic', 'Direct', 'Referral', 'Social', 'Email'], datasets: [{ data: [42, 24, 16, 12, 6], backgroundColor: ['#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'], borderWidth: 0 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, color: '#4b5563' } } } }
            });
        }
        const ctx4 = document.getElementById('chart-pages');
        if (ctx4) {
            new Chart(ctx4, {
                type: 'bar',
                data: { labels: ['/pricing', '/features', '/docs', '/blog', '/login', '/home'], datasets: [{ label: 'Visits', data: [12400, 9800, 7200, 5100, 3800, 2100], backgroundColor: '#f97316', borderRadius: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#9ca3af' } }, y: { grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af' } } } }
            });
        }
    }

    // ───── Live Chat Widget ─────
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatFormEl = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', () => chatWindow.classList.toggle('open'));
        if (chatClose) chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));
    }

    if (chatFormEl) {
        chatFormEl.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = chatInput.value.trim();
            if (!msg) return;
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-msg user';
            userMsg.textContent = msg;
            chatMessages.appendChild(userMsg);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'chat-msg bot';
                botMsg.textContent = ['Thanks for reaching out! Our team will get back to you shortly.', 'Great question! Check out our docs for more details.', 'I\'d be happy to help! Let me connect you with a specialist.', 'That\'s a common request. Our pricing page has more info.', 'Got it! Someone from sales will follow up.'][Math.floor(Math.random() * 5)];
                chatMessages.appendChild(botMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        });
    }

    // ───── Newsletter Modal ─────
    const modal = document.getElementById('newsletter-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalDismiss = document.querySelector('.modal-dismiss');
    const modalForm = document.getElementById('modal-form');

    if (modal && !localStorage.getItem('nexus_modal_dismissed')) {
        setTimeout(() => modal.classList.add('open'), 15000);
        const closeModal = () => { modal.classList.remove('open'); localStorage.setItem('nexus_modal_dismissed', 'true'); };
        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalDismiss) modalDismiss.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        if (modalForm) modalForm.addEventListener('submit', (e) => { e.preventDefault(); closeModal(); });
    }

    // ───── API Playground ─────
    const tabs = document.querySelectorAll('.playground-tab');
    const panels = document.querySelectorAll('.playground-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });

    // ───── API Playground (fallback when no json-server) ─────
    if (!cfg.JSON_SERVER_URL) {
        document.querySelectorAll('.playground-send').forEach(btn => {
            btn.addEventListener('click', () => {
                const panel = btn.closest('.playground-panel');
                const textarea = panel.querySelector('textarea');
                const response = panel.querySelector('.playground-response');
                const body = textarea.value.trim();
                if (!body) { response.textContent = 'Error: Request body is empty.'; response.className = 'playground-response error'; return; }
                response.textContent = 'Sending request...';
                response.className = 'playground-response';
                setTimeout(() => {
                    response.textContent = JSON.stringify({ status: 'ok', message: 'Event tracked successfully.', id: 'evt_' + Math.random().toString(36).slice(2, 10) }, null, 2);
                    response.className = 'playground-response success';
                }, 800);
            });
        });
    }

    // ───── Lazy Load Images ─────
    const lazyImages = document.querySelectorAll('.lazy');
    if (lazyImages.length) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imgObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imgObserver.observe(img));
    }

    // ───── Initialize API Integrations ─────
    initGitHubStars();
    initEmailJS();
    initMailchimp();
    initStripe();
    initFirebaseAuth();
    initJsonServerPlayground();
    initNewsletterFallback();

    // ───── Back to Top Button ─────
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ───── Cookie Consent Banner ─────
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner && !localStorage.getItem('nexus_cookie_consent')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('nexus_cookie_consent', 'accepted');
                cookieBanner.classList.remove('visible');
            });
        }
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                localStorage.setItem('nexus_cookie_consent', 'declined');
                cookieBanner.classList.remove('visible');
            });
        }
    }

    // ───── Enhanced Scroll Animations ─────
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-scale, .fade-in-left, .fade-in-right, .stagger-children').forEach(el => animObserver.observe(el));

    // ───── Blog Search ─────
    const blogSearch = document.getElementById('blog-search');
    const blogCards = document.querySelectorAll('.blog-card');
    const noResults = document.getElementById('blog-no-results');
    if (blogSearch && blogCards.length) {
        blogSearch.addEventListener('input', () => {
            const q = blogSearch.value.trim().toLowerCase();
            let count = 0;
            blogCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                const desc = card.querySelector('p')?.textContent?.toLowerCase() || '';
                const cat = card.querySelector('.blog-category')?.textContent?.toLowerCase() || '';
                const match = !q || title.includes(q) || desc.includes(q) || cat.includes(q);
                card.style.display = match ? '' : 'none';
                if (match) count++;
            });
            if (noResults) noResults.classList.toggle('visible', count === 0);
        });
    }

    // ───── Social Share Buttons ─────
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(btn.dataset.url || window.location.href);
            const title = encodeURIComponent(btn.dataset.title || document.title);
            const platform = btn.dataset.platform;
            let shareUrl = '';
            if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
            else if (platform === 'linkedin') shareUrl = `https://linkedin.com/sharing/share-offsite/?url=${url}`;
            else if (platform === 'copy') {
                navigator.clipboard.writeText(decodeURIComponent(url)).then(() => {
                    const orig = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(() => btn.textContent = orig, 2000);
                });
                return;
            }
            if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });

    // ───── Loading Skeleton Toggle ─────
    document.querySelectorAll('[data-skeleton]').forEach(el => {
        const realId = el.dataset.skeleton;
        const realEl = document.getElementById(realId);
        if (realEl) {
            const observer = new MutationObserver(() => {
                if (realEl.textContent && realEl.textContent !== 'loading...' && realEl.textContent !== '—') {
                    el.classList.remove('skeleton');
                    observer.disconnect();
                }
            });
            observer.observe(realEl, { childList: true, characterData: true, subtree: true });
        }
    });

});
