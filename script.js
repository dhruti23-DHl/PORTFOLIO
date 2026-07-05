/* ============================
   LANDING PAGE
============================ */
(function () {

  /* ── Canvas particle network ── */
  const lc  = document.getElementById('landing-canvas');
  if (!lc) return;
  const lctx = lc.getContext('2d');
  let lW, lH, lPts = [];

  function lResize() {
    lW = lc.width  = lc.offsetWidth;
    lH = lc.height = lc.offsetHeight;
  }
  lResize();
  window.addEventListener('resize', lResize);

  for (let i = 0; i < 70; i++) {
    lPts.push({
      x: Math.random() * lW, y: Math.random() * lH,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      c: Math.random() > 0.5 ? '108,99,255' : '6,182,212'
    });
  }

  function lDraw() {
    lctx.clearRect(0, 0, lW, lH);
    lPts.forEach(p => {
      lctx.beginPath();
      lctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      lctx.fillStyle = `rgba(${p.c},0.6)`;
      lctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > lW) p.vx *= -1;
      if (p.y < 0 || p.y > lH) p.vy *= -1;
    });
    for (let i = 0; i < lPts.length; i++) {
      for (let j = i + 1; j < lPts.length; j++) {
        const d = Math.hypot(lPts[i].x - lPts[j].x, lPts[i].y - lPts[j].y);
        if (d < 110) {
          lctx.beginPath();
          lctx.moveTo(lPts[i].x, lPts[i].y);
          lctx.lineTo(lPts[j].x, lPts[j].y);
          lctx.strokeStyle = `rgba(108,99,255,${0.12 * (1 - d / 110)})`;
          lctx.lineWidth = 0.6;
          lctx.stroke();
        }
      }
    }
    requestAnimationFrame(lDraw);
  }
  lDraw();

  /* ── Matrix rain on left panel ── */
  const mc   = document.getElementById('matrix-canvas');
  const mctx = mc.getContext('2d');
  let mW, mH, cols, drops;
  const chars = 'ABCDEFアイウエオカキクケコ0123456789#%&@!</>{}[]';

  function mResize() {
    const parent = mc.parentElement;
    mW = mc.width  = parent.offsetWidth;
    mH = mc.height = parent.offsetHeight;
    cols = Math.floor(mW / 14);
    drops = Array(cols).fill(1);
  }
  mResize();
  window.addEventListener('resize', mResize);

  function mDraw() {
    mctx.fillStyle = 'rgba(8,8,18,0.05)';
    mctx.fillRect(0, 0, mW, mH);
    mctx.fillStyle = '#6c63ff';
    mctx.font = '12px monospace';
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      mctx.fillText(ch, i * 14, y * 14);
      if (y * 14 > mH && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(mDraw, 60);

  /* ── GitHub contribution heatmap ── */
  const grid = document.getElementById('gh-grid');
  if (grid) {
    const levels = ['#0d1117','#0e4429','#006d32','#26a641','#39d353'];
    for (let i = 0; i < 130; i++) {
      const cell = document.createElement('div');
      cell.className = 'gh-cell';
      const lvl = Math.floor(Math.random() * 5);
      cell.style.background = levels[lvl];
      cell.style.animationDelay = (Math.random() * 3) + 's';
      grid.appendChild(cell);
    }
  }

  /* ── Enter button click ── */
  document.getElementById('enter-btn').addEventListener('click', () => {
    const page = document.getElementById('landing-page');
    page.classList.add('exit');
    // After animation, hide it fully and unlock scroll
    setTimeout(() => {
      page.style.display = 'none';
      document.body.classList.remove('landing-open');
    }, 950);
  });

  /* Lock scroll while landing shows */
  document.body.classList.add('landing-open');

})();

/* ============================
   PRELOADER
============================ */
const preloader     = document.getElementById('preloader');
const preloaderFill = document.getElementById('preloader-fill');
const preloaderText = document.getElementById('preloader-text');
const heroContent   = document.querySelector('.reveal-hero');

let progress = 0;
const messages = ['Loading', 'Preparing', 'Almost ready', 'Welcome'];
let msgIdx = 0;

const loaderInterval = setInterval(() => {
  const increment = progress < 70 ? Math.random() * 6 + 2 : Math.random() * 3 + 1;
  progress = Math.min(progress + increment, 99);
  preloaderFill.style.width = progress + '%';
  const newIdx = Math.floor((progress / 100) * messages.length);
  if (newIdx !== msgIdx && newIdx < messages.length) {
    msgIdx = newIdx;
    preloaderText.innerHTML = messages[msgIdx] + '<span class="dots">...</span>';
  }
}, 60);

window.addEventListener('load', () => {
  clearInterval(loaderInterval);
  preloaderFill.style.transition = 'width 0.4s ease';
  preloaderFill.style.width = '100%';
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.classList.remove('loading');
    heroContent.classList.add('visible');
  }, 500);
});

// Fallback — force hide after 4s
setTimeout(() => {
  if (!preloader.classList.contains('hidden')) {
    preloader.classList.add('hidden');
    document.body.classList.remove('loading');
    heroContent.classList.add('visible');
  }
}, 4000);

/* ============================
   NAVBAR — scroll & mobile
============================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('visible', window.scrollY > 400);
  setActiveLink();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
  const spans = hamburger.querySelectorAll('span');
  if (hamburger.classList.contains('active')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* Active link highlight */
const sections = document.querySelectorAll('section[id]');
const navItems  = navLinks.querySelectorAll('a');

function setActiveLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  navItems.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
setActiveLink();

/* ============================
   BACK TO TOP
============================ */
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ============================
   TYPED TEXT ANIMATION
============================ */
const roles  = ['Frontend Developer'];  //, 'UI/UX Enthusiast', 'Problem Solver'
const target = document.getElementById('typed-text');
let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;

function typeEffect() {
  const current = roles[roleIndex];
  target.textContent = isDeleting
    ? current.substring(0, charIndex - 1)
    : current.substring(0, charIndex + 1);
  isDeleting ? charIndex-- : charIndex++;

  let speed = isDeleting ? 55 : 95;
  if (!isDeleting && charIndex === current.length) { speed = 1800; isDeleting = true; }
  else if (isDeleting && charIndex === 0)           { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; speed = 400; }

  setTimeout(typeEffect, speed);
}
// Start typed effect after hero reveals
setTimeout(typeEffect, 1200);

/* ============================
   SCROLL FADE-UP / LEFT / RIGHT / ZOOM-IN ANIMATIONS
============================ */
const animEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom-in');

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.children]
      .filter(c => c.classList.contains('fade-up') || c.classList.contains('fade-left') ||
                   c.classList.contains('fade-right') || c.classList.contains('zoom-in'));
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), idx * 110);
    animObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

animEls.forEach(el => animObserver.observe(el));

/* Section titles reveal */
document.querySelectorAll('.section-title').forEach(t => t.classList.add('title-reveal'));
const titleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); titleObserver.unobserve(entry.target); }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.section-title.title-reveal').forEach(t => titleObserver.observe(t));

/* ============================
   SKILL BARS ANIMATION
============================ */
const skillBars = document.querySelectorAll('.skill-bar-fill, .gh-lang-bar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width + '%';
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(bar => barObserver.observe(bar));

/* ============================
   STATS COUNT-UP + PROGRESS BARS
============================ */
const statCounts = document.querySelectorAll('.stat-count');
const statFills  = document.querySelectorAll('.stat-progress-fill');

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const end = parseInt(el.dataset.target);
    if (isNaN(end)) return;
    let count = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      count = Math.min(count + step, end);
      el.textContent = count;
      if (count >= end) clearInterval(timer);
    }, 28);
    statObserver.unobserve(el);
  });
}, { threshold: 0.4 });
statCounts.forEach(c => statObserver.observe(c));

const statBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width + '%';
      statBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
statFills.forEach(b => statBarObserver.observe(b));

/* ============================
   TESTIMONIALS CAROUSEL
============================ */
const track     = document.getElementById('testimonial-track');
const slides    = track ? [...track.children] : [];
const dotsWrap  = document.getElementById('testi-dots');
const prevBtn   = document.getElementById('testi-prev');
const nextBtn   = document.getElementById('testi-next');
let   curSlide  = 0;
let   autoSlide;

if (slides.length) {
  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  function goToSlide(idx) {
    curSlide = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${curSlide * 100}%)`;
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === curSlide));
  }

  function startAuto() { autoSlide = setInterval(() => goToSlide(curSlide + 1), 4000); }
  function stopAuto()  { clearInterval(autoSlide); }

  prevBtn.addEventListener('click', () => { stopAuto(); goToSlide(curSlide - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); goToSlide(curSlide + 1); startAuto(); });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { stopAuto(); goToSlide(diff > 0 ? curSlide + 1 : curSlide - 1); startAuto(); }
  });

  startAuto();
}

/* ============================
   PARALLAX SCROLL
============================ */
const parallaxEls = document.querySelectorAll('[data-parallax]');

function handleParallax() {
  parallaxEls.forEach(el => {
    const speed  = parseFloat(el.dataset.parallax) || 0.3;
    const rect   = el.getBoundingClientRect();
    const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
    el.style.backgroundPositionY = `calc(50% + ${offset}px)`;
  });
}
window.addEventListener('scroll', handleParallax, { passive: true });
handleParallax();

/* ============================
   FOOTER FADE-IN
============================ */
const footerEl = document.getElementById('footer');
if (footerEl) {
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); footerObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  footerObserver.observe(footerEl);
}

/* ============================
   COUNTER ANIMATION (resume stats)
============================ */
const counters = document.querySelectorAll('.r-stat span');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const raw    = el.textContent.trim();
    const end    = parseInt(raw);
    if (isNaN(end)) return;
    const suffix = raw.replace(/[0-9]/g, '');
    let count    = 0;
    const step   = Math.ceil(end / 50);
    const timer  = setInterval(() => {
      count = Math.min(count + step, end);
      el.textContent = count + suffix;
      if (count >= end) clearInterval(timer);
    }, 30);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ============================
   CTA MODAL
============================ */
const modalOverlay = document.getElementById('cta-modal-overlay');
const modalClose   = document.getElementById('modal-close');
const modalTitle   = document.getElementById('modal-title');
const modalDesc    = document.getElementById('modal-desc');
const modalIcon    = document.getElementById('modal-icon');
const modalForm    = document.getElementById('modal-form');
const modalStatus  = document.getElementById('modal-status');

const ctaConfig = {
  'preorder': {
    icon: 'fa-rocket',
    iconBg: 'rgba(108,99,255,0.18)',
    iconColor: '#6c63ff',
    title: 'Preorder Now',
    desc: 'Be among the first to get access. Drop your details and I\'ll reach out personally.',
    btn: 'Confirm Preorder'
  },
  'early-access': {
    icon: 'fa-key',
    iconBg: 'rgba(245,158,11,0.15)',
    iconColor: '#f59e0b',
    title: 'Get Early Access',
    desc: 'Get exclusive early access before the public launch. Limited spots available!',
    btn: 'Request Access'
  },
  'waitlist': {
    icon: 'fa-list-check',
    iconBg: 'rgba(59,130,246,0.15)',
    iconColor: '#60a5fa',
    title: 'Join the Waitlist',
    desc: 'Join the waitlist and be notified the moment something exciting launches.',
    btn: 'Join Waitlist'
  },
  'reserve': {
    icon: 'fa-calendar-check',
    iconBg: 'rgba(16,185,129,0.15)',
    iconColor: '#34d399',
    title: 'Reserve Your Spot',
    desc: 'Reserve a dedicated spot for your project or collaboration. Slots are limited.',
    btn: 'Reserve Spot'
  },
  'journey': {
    icon: 'fa-flag-checkered',
    iconBg: 'rgba(236,72,153,0.15)',
    iconColor: '#f472b6',
    title: 'Start Your Journey',
    desc: 'Ready to kick things off? Share your idea and let\'s build something amazing.',
    btn: 'Let\'s Go 🚀'
  }
};

function openCTAModal(type) {
  const cfg = ctaConfig[type];
  if (!cfg) return;

  modalIcon.innerHTML  = `<i class="fa-solid ${cfg.icon}"></i>`;
  modalIcon.style.background   = cfg.iconBg;
  modalIcon.style.borderColor  = cfg.iconColor;
  modalIcon.style.color        = cfg.iconColor;
  modalTitle.textContent       = cfg.title;
  modalDesc.textContent        = cfg.desc;
  modalForm.querySelector('.modal-submit').innerHTML = `${cfg.btn} <i class="fa-solid fa-arrow-right"></i>`;
  modalForm.dataset.type       = type;
  modalStatus.textContent      = '';
  modalForm.reset();
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCTAModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeCTAModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeCTAModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCTAModal(); });

modalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn  = modalForm.querySelector('.modal-submit');
  btn.disabled    = true;
  btn.textContent = 'Submitting…';

  // Swap this setTimeout with your real backend / EmailJS / Formspree call
  setTimeout(() => {
    modalStatus.textContent = '✅ Done! I\'ll be in touch very soon.';
    modalForm.reset();
    btn.disabled  = false;
    btn.innerHTML = `${ctaConfig[modalForm.dataset.type].btn} <i class="fa-solid fa-arrow-right"></i>`;
    setTimeout(closeCTAModal, 2500);
  }, 1400);
});

/* ============================
   CONTACT FORM
============================ */
const form       = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn     = form.querySelector('button[type="submit"]');
  btn.disabled  = true;
  btn.textContent = 'Sending…';

  setTimeout(() => {
    formStatus.textContent = '✅ Message sent! I\'ll get back to you soon.';
    form.reset();
    btn.disabled  = false;
    btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    setTimeout(() => { formStatus.textContent = ''; }, 5000);
  }, 1500);
});

/* ============================
   FOOTER YEAR
============================ */
document.getElementById('year').textContent = new Date().getFullYear();
