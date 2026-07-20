// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle) menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));

// Services dropdown
document.querySelectorAll('.has-dropdown > button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const parent = btn.parentElement;
    const wasOpen = parent.classList.contains('open');
    document.querySelectorAll('.has-dropdown.open').forEach(d => d.classList.remove('open'));
    if (!wasOpen) parent.classList.add('open');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.has-dropdown.open').forEach(d => d.classList.remove('open'));
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Hex field background (hero)
const hexField = document.getElementById('hexField');
if (hexField){
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns,'svg');
  svg.setAttribute('width','100%'); svg.setAttribute('height','100%');
  svg.setAttribute('viewBox','0 0 1200 800'); svg.setAttribute('preserveAspectRatio','xMidYMid slice');
  const rows = 8, cols = 14, r = 46;
  for (let row=0; row<rows; row++){
    for (let col=0; col<cols; col++){
      const x = col * (r*1.75) + (row%2 ? r*0.9 : 0) - 60;
      const y = row * (r*1.5) - 40;
      const pts = [];
      for (let i=0;i<6;i++){
        const ang = Math.PI/180 * (60*i - 30);
        pts.push((x + r*0.55*Math.cos(ang)).toFixed(1) + ',' + (y + r*0.55*Math.sin(ang)).toFixed(1));
      }
      const poly = document.createElementNS(ns,'polygon');
      poly.setAttribute('points', pts.join(' '));
      poly.setAttribute('fill','none');
      poly.setAttribute('stroke', 'rgba(255,255,255,0.035)');
      poly.setAttribute('stroke-width','1');
      svg.appendChild(poly);
    }
  }
  hexField.appendChild(svg);
}

// Coverage hex map
const hexmap = document.getElementById('hexmap');
if (hexmap){
  const cities = [
    {name:'NEOM', x:8, y:22, live:false},
    {name:'Tabuk', x:20, y:16, live:false},
    {name:'Al-Jouf', x:34, y:8, live:false},
    {name:'Hail', x:38, y:26, live:false},
    {name:'Al-Ula', x:18, y:36, live:false},
    {name:'Al-Qassim', x:46, y:34, live:false},
    {name:'Madinah', x:22, y:50, live:true},
    {name:'Dammam', x:80, y:32, live:true},
    {name:'Riyadh', x:56, y:56, live:true},
    {name:'Jeddah', x:14, y:66, live:true},
    {name:"Ta'if", x:28, y:74, live:false},
    {name:'Abha', x:32, y:88, live:false},
    {name:'Jizan', x:20, y:96, live:false},
  ];
  const nsSvg = 'http://www.w3.org/2000/svg';
  const lineSvg = document.createElementNS(nsSvg,'svg');
  lineSvg.setAttribute('class','hexlines');
  lineSvg.setAttribute('viewBox','0 0 100 100');
  lineSvg.setAttribute('preserveAspectRatio','none');
  const liveCities = cities.filter(c => c.live);
  for (let i=0;i<liveCities.length;i++){
    for (let j=i+1;j<liveCities.length;j++){
      const l = document.createElementNS(nsSvg,'line');
      l.setAttribute('x1', liveCities[i].x); l.setAttribute('y1', liveCities[i].y);
      l.setAttribute('x2', liveCities[j].x); l.setAttribute('y2', liveCities[j].y);
      l.setAttribute('stroke','rgba(242,180,41,0.18)');
      l.setAttribute('stroke-width','0.3');
      lineSvg.appendChild(l);
    }
  }
  hexmap.appendChild(lineSvg);
  cities.forEach(c => {
    const node = document.createElement('div');
    node.className = 'hexnode' + (c.live ? ' live' : '');
    node.style.left = c.x + '%';
    node.style.top = c.y + '%';
    node.innerHTML = '<div class="dot"></div><label>' + c.name + '</label>';
    hexmap.appendChild(node);
  });
}

// Radar dots (hero panel)
const radarWrap = document.getElementById('radarWrap');
if (radarWrap){
  const radarPts = [[30,25],[68,20],[75,60],[22,70],[50,50]];
  radarPts.forEach(([x,y],i) => {
    const d = document.createElement('div');
    d.className = 'radar-dot';
    d.style.left = x + '%'; d.style.top = y + '%';
    d.style.animation = 'pulse ' + (2 + i*0.4) + 's infinite';
    radarWrap.appendChild(d);
  });
}

// Tab component (generic) - used on subpages with [data-tabs]
document.querySelectorAll('[data-tabs]').forEach(group => {
  const tabs = group.querySelectorAll('[data-tab]');
  const panels = group.querySelectorAll('[data-panel]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      group.querySelector('[data-panel="' + tab.dataset.tab + '"]').classList.add('active');
    });
  });
});

// Contact form now submits directly to ops@amisec.net via FormSubmit (see contact.html form action).
// No JS interception needed - the browser performs a real POST to FormSubmit's endpoint.

// ---------- Language toggle (EN / AR) ----------
(function(){
  const STORAGE_KEY = 'amisec-lang';
  const toggle = document.getElementById('langToggle');

  function applyLang(lang){
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-ar', lang === 'ar');
    const dict = (window.AR_DICT || {});
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (el.dataset.i18nEn === undefined) {
        el.dataset.i18nEn = el.textContent;
      }
      if (lang === 'ar') {
        const key = el.getAttribute('data-i18n');
        el.textContent = (key in dict) ? dict[key] : el.dataset.i18nEn;
      } else {
        el.textContent = el.dataset.i18nEn;
      }
    });
    if (toggle) toggle.classList.toggle('is-ar', lang === 'ar');
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.lang === 'ar' ? 'ar' : 'en';
      applyLang(current === 'ar' ? 'en' : 'ar');
    });
  }

  let saved = 'en';
  try { saved = localStorage.getItem(STORAGE_KEY) || 'en'; } catch (e) {}
  applyLang(saved);
})();

// ---------- Hero airport carousel (auto-rotate every 3.5s) ----------
(function(){
  const carousel = document.getElementById('heroCarousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.hero-slide');
  let idx = 0;

  function show(i){
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === idx));
  }

  setInterval(() => show(idx + 1), 3500);
})();

// ---------- Airport carousel (auto-rotate every 10s) ----------
(function(){
  const carousel = document.getElementById('airportCarousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.airport-slide');
  const dots = carousel.querySelectorAll('.carousel-dots button');
  let idx = 0;
  let timer;

  function show(i){
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === idx));
    dots.forEach((d, n) => d.classList.toggle('active', n === idx));
  }

  function start(){
    timer = setInterval(() => show(idx + 1), 10000);
  }

  function restart(){
    clearInterval(timer);
    start();
  }

  dots.forEach((d, i) => {
    d.addEventListener('click', () => { show(i); restart(); });
  });

  show(0);
  start();
})();

// ---------- Scroll progress bar + nav scrolled state + back-to-top ----------
(function(){
  const progress = document.getElementById('scrollProgress');
  const header = document.querySelector('header');
  const backToTop = document.getElementById('backToTop');

  function onScroll(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
    if (header) header.classList.toggle('scrolled', scrollTop > 30);
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 500);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

// ---------- Count-up animation for stat numbers ----------
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.hero-stats b, .stat-card b');
  if (!targets.length) return;

  function animate(el){
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)$/);
    if (!match) return;
    const digits = match[1];
    const suffix = match[2];
    if (/\d/.test(suffix) || prefersReduced) return; // skip things like "24/7"
    const target = parseInt(digits, 10);
    const padLen = digits.length;
    const duration = 1200;
    const start = performance.now();
    function step(now){
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const current = Math.round(eased * target);
      el.textContent = String(current).padStart(padLen, '0') + suffix;
      if (elapsed < 1) requestAnimationFrame(step);
      else el.textContent = digits + suffix;
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });

  targets.forEach(el => io.observe(el));
})();

// ---------- Subtle parallax on photo banners ----------
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  const banners = document.querySelectorAll('.page-header.has-photo, .hero-slide');
  if (!banners.length) return;

  let ticking = false;
  function update(){
    banners.forEach(el => {
      const rect = el.getBoundingClientRect();
      const shift = rect.top * 0.08;
      el.style.backgroundPositionY = `calc(50% + ${shift}px)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
})();
