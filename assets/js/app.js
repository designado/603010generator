// ─── State ────────────────────────────────────────────────────────────────────
var baseColor      = '#7c3aed';
var locked         = { c60: false, c30: false };
var currentPalette = {};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
var colorPicker   = document.getElementById('colorPicker');
var swatchBg      = document.getElementById('swatchBg');
var regenBtn      = document.getElementById('regenBtn');
var harmonyBadge  = document.getElementById('harmonyBadge');
var lockStatus    = document.getElementById('lockStatus');
var lockStatusTxt = document.getElementById('lockStatusTxt');

var s60el = document.getElementById('s60');
var s30el = document.getElementById('s30');
var s10el = document.getElementById('s10');

// ─── Logo colors ──────────────────────────────────────────────────────────────
function updateLogoColors(c60, c30, c10) {
  document.getElementById('logoNum60').style.color = c60;
  document.getElementById('logoNum30').style.color = c30;
  document.getElementById('logoNum10').style.color = c10;
}

function randomHex() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

// ─── Apply palette to DOM ─────────────────────────────────────────────────────
function applyPalette(palette, skipAnimation) {
  var c10 = palette.c10;
  var c30 = palette.c30;
  var c60 = palette.c60;
  var harmonyName = palette.harmonyName;

  // Resolve final colors (generatePalette already handles locks,
  // but currentPalette must be set before use)
  var finalC60 = c60;
  var finalC30 = c30;

  currentPalette = { c10: c10, c30: finalC30, c60: finalC60 };

  // Backgrounds
  s60el.style.backgroundColor = finalC60;
  s30el.style.backgroundColor = finalC30;
  s10el.style.backgroundColor = c10;

  // Text contrast per swatch
  var swatchData = [
    { el: s60el, color: finalC60 },
    { el: s30el, color: finalC30 },
    { el: s10el, color: c10 }
  ];

  swatchData.forEach(function(item) {
    var tc = textColor(item.color);
    item.el.querySelectorAll('.swatch-percentage, .swatch-role, .user-badge').forEach(function(t) {
      t.style.color = tc;
    });
    var hexEl = item.el.querySelector('.swatch-hex');
    if (hexEl) hexEl.style.color = tc;
  });

  // Hex labels on swatches
  document.getElementById('hex60').textContent = finalC60.toUpperCase();
  document.getElementById('hex30').textContent = finalC30.toUpperCase();
  document.getElementById('hex10').textContent = c10.toUpperCase();

  document.getElementById('dot60').style.backgroundColor = finalC60;
  document.getElementById('dot30').style.backgroundColor = finalC30;
  document.getElementById('dot10').style.backgroundColor = c10;

  document.getElementById('vhex60').textContent = finalC60.toUpperCase();
  document.getElementById('vhex30').textContent = finalC30.toUpperCase();
  document.getElementById('vhex10').textContent = c10.toUpperCase();

  document.getElementById('vrgb60').textContent = hexToRgb(finalC60);
  document.getElementById('vrgb30').textContent = hexToRgb(finalC30);
  document.getElementById('vrgb10').textContent = hexToRgb(c10);

  // Harmony
  harmonyBadge.textContent = harmonyName;

  // Picker swatch circle
  swatchBg.style.backgroundColor = c10;

  // Pulse on unlocked swatches
  if (!skipAnimation) {
    if (!locked.c60) triggerPulse(s60el);
    if (!locked.c30) triggerPulse(s30el);
  }

  // Logo title colors
  updateLogoColors(finalC60, finalC30, c10);

  updateLockStatus();
}

function triggerPulse(el) {
  el.classList.remove('swatch-pulse');
  void el.offsetWidth;
  el.classList.add('swatch-pulse');
  el.addEventListener('animationend', function() {
    el.classList.remove('swatch-pulse');
  }, { once: true });
}

// ─── Lock logic ───────────────────────────────────────────────────────────────
function toggleLock(slot) {
  locked[slot] = !locked[slot];

  var swatchEl  = slot === 'c60' ? s60el : s30el;
  var cardEl    = document.getElementById(slot === 'c60' ? 'card60' : 'card30');
  var lockBtnEl = swatchEl.querySelector('.lock-btn');

  swatchEl.classList.toggle('locked', locked[slot]);
  if (cardEl) cardEl.classList.toggle('card-locked', locked[slot]);

  lockBtnEl.classList.remove('lock-pop');
  void lockBtnEl.offsetWidth;
  lockBtnEl.classList.add('lock-pop');
  lockBtnEl.addEventListener('animationend', function() {
    lockBtnEl.classList.remove('lock-pop');
  }, { once: true });

  updateLockIcon(lockBtnEl, locked[slot]);
  updateLockStatus();
}

function updateLockIcon(btn, isLocked) {
  var svg = btn.querySelector('svg');
  if (isLocked) {
    svg.innerHTML = '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>';
    btn.setAttribute('title', 'Desbloquear cor');
    btn.setAttribute('aria-label', 'Desbloquear cor');
  } else {
    svg.innerHTML = '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>';
    btn.setAttribute('title', 'Travar esta cor');
    btn.setAttribute('aria-label', 'Travar esta cor');
  }
}

function updateLockStatus() {
  var names = [];
  if (locked.c60) names.push('60%');
  if (locked.c30) names.push('30%');

  var allLocked = locked.c60 && locked.c30;
  var hasLock   = names.length > 0;

  lockStatus.classList.toggle('active', hasLock);

  if (allLocked) {
    lockStatusTxt.textContent = '60% e 30% travadas — apenas o destaque varia';
  } else if (hasLock) {
    lockStatusTxt.textContent = names.join(' e ') + ' travada' + (names.length > 1 ? 's' : '');
  } else {
    lockStatusTxt.textContent = 'Clique no cadeado para travar uma cor';
  }
}

// ─── Copy to clipboard ────────────────────────────────────────────────────────
function setupCopy(id, getVal) {
  var el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', function() {
    var val = getVal();
    navigator.clipboard.writeText(val).then(function() {
      el.classList.add('copied');
      setTimeout(function() { el.classList.remove('copied'); }, 1300);
    });
  });
}

function getHex60() { return document.getElementById('vhex60').textContent; }
function getHex30() { return document.getElementById('vhex30').textContent; }
function getHex10() { return document.getElementById('vhex10').textContent; }

setupCopy('hex60',  getHex60);
setupCopy('hex30',  getHex30);
setupCopy('hex10',  getHex10);
setupCopy('vhex60', getHex60);
setupCopy('vhex30', getHex30);
setupCopy('vhex10', getHex10);

// ─── Regen ────────────────────────────────────────────────────────────────────
function regen() {
  var palette = generatePalette(baseColor, {
    randomHarmony: !(locked.c60 && locked.c30),
    locked: locked,
    currentPalette: currentPalette
  });
  applyPalette(palette);
}

// ─── Color picker sync ────────────────────────────────────────────────────────
colorPicker.addEventListener('input', function(e) {
  baseColor = e.target.value;
  swatchBg.style.backgroundColor = baseColor;
  // stop invite animation once user picks a color
  document.querySelector('.color-swatch-btn').classList.add('used');
  resetLocks();
  applyPalette(generatePalette(baseColor, { randomHarmony: true }));
});

function resetLocks() {
  locked = { c60: false, c30: false };
  [s60el, s30el].forEach(function(el) {
    el.classList.remove('locked');
    updateLockIcon(el.querySelector('.lock-btn'), false);
  });
  var card60 = document.getElementById('card60');
  var card30 = document.getElementById('card30');
  if (card60) card60.classList.remove('card-locked');
  if (card30) card30.classList.remove('card-locked');
}

// ─── Spacebar ────────────────────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
    regen();
  }
});

// ─── Regen button ─────────────────────────────────────────────────────────────
regenBtn.addEventListener('click', regen);

// ─── Preview button ───────────────────────────────────────────────────────────
document.getElementById('previewBtn').addEventListener('click', openPreview);

function openPreview() {
  var c60 = currentPalette.c60 || '#1a1a2e';
  var c30 = currentPalette.c30 || '#4a4a8a';
  var c10 = currentPalette.c10 || baseColor;

  // derive readable text colors
  var textOn60 = luminance(c60) > 0.35 ? '#111111' : '#f5f5f5';
  var textOn30 = luminance(c30) > 0.35 ? '#111111' : '#f5f5f5';
  var textOn10 = luminance(c10) > 0.35 ? '#111111' : '#f5f5f5';

  // muted variants
  var mutedOn60 = luminance(c60) > 0.35 ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';
  var mutedOn30 = luminance(c30) > 0.35 ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';

  // subtle surface on top of 60
  var surfaceAlpha = luminance(c60) > 0.35 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
  var surfaceBorder = luminance(c60) > 0.35 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  // picsum.photos — gratuito, sem autenticação, imagens aleatórias por seed numérico
  var baseId = Math.floor(Math.random() * 900) + 100; // seed base aleatório

  var html = '<!DOCTYPE html><html lang="pt-BR"><head>' +
    '<meta charset="UTF-8"/>' +
    '<meta name="viewport" content="width=device-width,initial-scale=1.0"/>' +
    '<title>Preview — 60·30·10</title>' +
    '<link rel="preconnect" href="https://fonts.googleapis.com"/>' +
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>' +
    '<style>' +
      '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}' +
      'body{font-family:"Inter",system-ui,sans-serif;background:' + c60 + ';color:' + textOn60 + '}' +

      /* ── NAV ── */
      'nav{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 5%;background:' + c60 + ';border-bottom:1px solid ' + surfaceBorder + ';position:sticky;top:0;z-index:100}' +
      '.nav-logo{font-weight:900;font-size:1.1rem;letter-spacing:-0.03em;color:' + textOn60 + '}' +
      '.nav-logo span{color:' + c10 + '}' +
      '.nav-links{display:flex;gap:2rem;list-style:none}' +
      '.nav-links a{text-decoration:none;font-size:0.85rem;font-weight:500;color:' + mutedOn60 + ';transition:color .2s}' +
      '.nav-links a:hover{color:' + textOn60 + '}' +
      '.nav-cta{background:' + c10 + ';color:' + textOn10 + ';border:none;border-radius:999px;padding:0.5rem 1.2rem;font-family:inherit;font-size:0.82rem;font-weight:700;cursor:pointer}' +

      /* ── HERO ── */
      '.hero{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;padding:5rem 5%;min-height:88vh}' +
      '.hero-tag{display:inline-flex;align-items:center;gap:0.4rem;background:' + surfaceAlpha + ';border:1px solid ' + surfaceBorder + ';border-radius:999px;padding:0.3rem 0.8rem;font-size:0.72rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:' + c10 + ';margin-bottom:1.2rem}' +
      '.hero-tag::before{content:"";width:6px;height:6px;border-radius:50%;background:' + c10 + '}' +
      '.hero h1{font-size:clamp(2rem,4.5vw,3.8rem);font-weight:900;letter-spacing:-0.04em;line-height:1.08;margin-bottom:1.2rem;color:' + textOn60 + '}' +
      '.hero h1 em{font-style:normal;color:' + c10 + '}' +
      '.hero p{font-size:1rem;line-height:1.7;color:' + mutedOn60 + ';max-width:44ch;margin-bottom:2rem}' +
      '.hero-actions{display:flex;gap:0.75rem;flex-wrap:wrap}' +
      '.btn-primary{background:' + c10 + ';color:' + textOn10 + ';border:none;border-radius:12px;padding:0.85rem 1.8rem;font-family:inherit;font-size:0.9rem;font-weight:700;cursor:pointer}' +
      '.btn-secondary{background:transparent;color:' + textOn60 + ';border:1.5px solid ' + surfaceBorder + ';border-radius:12px;padding:0.85rem 1.8rem;font-family:inherit;font-size:0.9rem;font-weight:600;cursor:pointer}' +
      '.hero-img{border-radius:1.5rem;overflow:hidden;aspect-ratio:4/3;background:' + c30 + '}' +
      '.hero-img img{width:100%;height:100%;object-fit:cover;display:block}' +

      /* ── STATS ── */
      '.stats{background:' + c30 + ';padding:2.5rem 5%;display:flex;justify-content:center;gap:4rem;flex-wrap:wrap}' +
      '.stat{text-align:center}' +
      '.stat-num{font-size:2rem;font-weight:900;letter-spacing:-0.04em;color:' + textOn30 + '}' +
      '.stat-num span{color:' + c10 + '}' +
      '.stat-label{font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:' + mutedOn30 + ';margin-top:0.2rem}' +

      /* ── FEATURES ── */
      '.features{padding:5rem 5%}' +
      '.section-label{font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:' + c10 + ';margin-bottom:0.6rem}' +
      '.section-title{font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:800;letter-spacing:-0.03em;line-height:1.15;margin-bottom:3rem;color:' + textOn60 + ';max-width:30ch}' +
      '.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem}' +
      '.feat-card{background:' + surfaceAlpha + ';border:1px solid ' + surfaceBorder + ';border-radius:1.25rem;padding:1.6rem}' +
      '.feat-icon{width:40px;height:40px;border-radius:10px;background:' + c10 + ';display:flex;align-items:center;justify-content:center;margin-bottom:1rem}' +
      '.feat-icon svg{width:20px;height:20px;fill:none;stroke:' + textOn10 + ';stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
      '.feat-card h3{font-size:0.95rem;font-weight:700;margin-bottom:0.5rem;color:' + textOn60 + '}' +
      '.feat-card p{font-size:0.82rem;line-height:1.65;color:' + mutedOn60 + '}' +

      /* ── GALLERY ── */
      '.gallery{padding:0 5% 5rem}' +
      '.gallery-grid{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:200px 200px;gap:1rem}' +
      '.gallery-item{border-radius:1rem;overflow:hidden;background:' + c30 + '}' +
      '.gallery-item:first-child{grid-row:1/3}' +
      '.gallery-item img{width:100%;height:100%;object-fit:cover;display:block}' +

      /* ── TESTIMONIAL ── */
      '.testimonial{background:' + c30 + ';padding:5rem 5%;text-align:center}' +
      '.quote{font-size:clamp(1.1rem,2.5vw,1.6rem);font-weight:700;line-height:1.45;letter-spacing:-0.02em;color:' + textOn30 + ';max-width:60ch;margin:0 auto 1.5rem}' +
      '.quote-author{display:flex;align-items:center;justify-content:center;gap:0.75rem}' +
      '.author-avatar{width:40px;height:40px;border-radius:50%;background:' + c60 + ';overflow:hidden}' +
      '.author-avatar img{width:100%;height:100%;object-fit:cover}' +
      '.author-name{font-size:0.85rem;font-weight:600;color:' + textOn30 + '}' +
      '.author-role{font-size:0.75rem;color:' + mutedOn30 + '}' +

      /* ── CTA ── */
      '.cta{padding:5rem 5%;display:flex;flex-direction:column;align-items:center;text-align:center;gap:1.5rem}' +
      '.cta h2{font-size:clamp(1.8rem,4vw,3rem);font-weight:900;letter-spacing:-0.04em;line-height:1.1;color:' + textOn60 + '}' +
      '.cta h2 em{font-style:normal;color:' + c10 + '}' +
      '.cta p{font-size:0.95rem;color:' + mutedOn60 + ';max-width:48ch;line-height:1.65}' +
      '.cta-btn{background:' + c10 + ';color:' + textOn10 + ';border:none;border-radius:14px;padding:1rem 2.5rem;font-family:inherit;font-size:1rem;font-weight:800;cursor:pointer;letter-spacing:-0.01em}' +

      /* ── FOOTER ── */
      'footer{background:' + c30 + ';padding:2rem 5%;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}' +
      '.footer-logo{font-weight:900;font-size:0.95rem;color:' + textOn30 + '}' +
      '.footer-logo span{color:' + c10 + '}' +
      '.footer-note{font-size:0.72rem;color:' + mutedOn30 + '}' +
      '.palette-chips{display:flex;gap:0.4rem;align-items:center}' +
      '.chip{width:18px;height:18px;border-radius:50%;border:2px solid ' + surfaceBorder + '}' +

      /* ── RESPONSIVE ── */
      '@media(max-width:768px){' +
        '.hero{grid-template-columns:1fr;min-height:auto;padding:3rem 5%}' +
        '.hero-img{display:none}' +
        '.features-grid{grid-template-columns:1fr}' +
        '.gallery-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto}' +
        '.gallery-item:first-child{grid-row:auto;grid-column:1/3}' +
        '.stats{gap:2rem}' +
        '.nav-links{display:none}' +
      '}' +

      /* ── BADGE ── */
      '.preview-badge{position:fixed;bottom:1.2rem;right:1.2rem;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.12);border-radius:999px;padding:0.4rem 0.85rem;font-family:"Inter",sans-serif;font-size:0.7rem;color:rgba(255,255,255,0.6);display:flex;align-items:center;gap:0.4rem;z-index:999}' +
      '.preview-badge b{color:#fff}' +
    '</style>' +
    '</head><body>' +

    /* NAV */
    '<nav>' +
      '<div class="nav-logo">brand<span>.</span></div>' +
      '<ul class="nav-links">' +
        '<li><a href="#">Produto</a></li>' +
        '<li><a href="#">Recursos</a></li>' +
        '<li><a href="#">Preços</a></li>' +
        '<li><a href="#">Blog</a></li>' +
      '</ul>' +
      '<button class="nav-cta">Começar grátis</button>' +
    '</nav>' +

    /* HERO */
    '<section class="hero">' +
      '<div>' +
        '<div class="hero-tag">Novo · Versão 2.0</div>' +
        '<h1>A solução que sua equipe <em>sempre precisou</em></h1>' +
        '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>' +
        '<div class="hero-actions">' +
          '<button class="btn-primary">Começar agora</button>' +
          '<button class="btn-secondary">Ver demonstração</button>' +
        '</div>' +
      '</div>' +
      '<div class="hero-img"><img src="https://picsum.photos/seed/' + baseId + '/800/600" alt="Hero"/></div>' +
    '</section>' +

    /* STATS */
    '<section class="stats">' +
      '<div class="stat"><div class="stat-num">12<span>k</span></div><div class="stat-label">Usuários ativos</div></div>' +
      '<div class="stat"><div class="stat-num">98<span>%</span></div><div class="stat-label">Satisfação</div></div>' +
      '<div class="stat"><div class="stat-num">4<span>.9</span></div><div class="stat-label">Avaliação média</div></div>' +
      '<div class="stat"><div class="stat-num">50<span>+</span></div><div class="stat-label">Integrações</div></div>' +
    '</section>' +

    /* FEATURES */
    '<section class="features">' +
      '<div class="section-label">Recursos</div>' +
      '<div class="section-title">Tudo que você precisa para crescer</div>' +
      '<div class="features-grid">' +
        featureCard('M13 2L3 14h9l-1 8 10-12h-9l1-8z', 'Alta performance', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.') +
        featureCard('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'Segurança total', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.') +
        featureCard('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'Colaboração', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.') +
        featureCard('M3 3h18v18H3z M9 9h6M9 13h6M9 17h4', 'Relatórios', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.') +
        featureCard('M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', 'Integrações', 'Lorem ipsum dolor sit amet, consectetur adipiscing. Sed do eiusmod tempor incididunt ut labore.') +
        featureCard('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5v5l3 3', 'Suporte 24/7', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip commodo.') +
      '</div>' +
    '</section>' +

    /* GALLERY */
    '<section class="gallery">' +
      '<div class="section-label">Galeria</div>' +
      '<div class="section-title" style="margin-bottom:1.5rem">Veja em ação</div>' +
      '<div class="gallery-grid">' +
        '<div class="gallery-item"><img src="https://picsum.photos/seed/' + (baseId+1) + '/600/500" alt=""/></div>' +
        '<div class="gallery-item"><img src="https://picsum.photos/seed/' + (baseId+2) + '/400/300" alt=""/></div>' +
        '<div class="gallery-item"><img src="https://picsum.photos/seed/' + (baseId+3) + '/400/300" alt=""/></div>' +
        '<div class="gallery-item"><img src="https://picsum.photos/seed/' + (baseId+4) + '/400/300" alt=""/></div>' +
        '<div class="gallery-item"><img src="https://picsum.photos/seed/' + (baseId+5) + '/400/300" alt=""/></div>' +
      '</div>' +
    '</section>' +

    /* TESTIMONIAL */
    '<section class="testimonial">' +
      '<p class="quote">"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."</p>' +
      '<div class="quote-author">' +
        '<div class="author-avatar"><img src="https://picsum.photos/seed/' + (baseId+6) + '/80/80" alt=""/></div>' +
        '<div><div class="author-name">Maria Silva</div><div class="author-role">CEO, Empresa Lorem</div></div>' +
      '</div>' +
    '</section>' +

    /* CTA */
    '<section class="cta">' +
      '<h2>Pronto para <em>começar</em>?</h2>' +
      '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Comece hoje e veja a diferença em poucos minutos.</p>' +
      '<button class="cta-btn">Criar conta grátis →</button>' +
    '</section>' +

    /* FOOTER */
    '<footer>' +
      '<div class="footer-logo">brand<span>.</span></div>' +
      '<div class="palette-chips">' +
        '<div class="chip" style="background:' + c60 + '" title="60%"></div>' +
        '<div class="chip" style="background:' + c30 + '" title="30%"></div>' +
        '<div class="chip" style="background:' + c10 + '" title="10%"></div>' +
      '</div>' +
      '<div class="footer-note">© 2025 Brand Inc. Todos os direitos reservados.</div>' +
    '</footer>' +

    /* BADGE */
    '<div class="preview-badge">Prévia gerada por <b>60·30·10 generator</b></div>' +

    '</body></html>';

  var tab = window.open('', '_blank');
  if (tab) {
    tab.document.open();
    tab.document.write(html);
    tab.document.close();
  }
}

function featureCard(iconPath, title, text) {
  return '<div class="feat-card">' +
    '<div class="feat-icon"><svg viewBox="0 0 24 24"><path d="' + iconPath + '"/></svg></div>' +
    '<h3>' + title + '</h3>' +
    '<p>' + text + '</p>' +
    '</div>';
}

// ─── Lock buttons ─────────────────────────────────────────────────────────────
document.getElementById('lockBtn60').addEventListener('click', function() { toggleLock('c60'); });
document.getElementById('lockBtn30').addEventListener('click', function() { toggleLock('c30'); });

// ─── Mobile double-tap to regen ───────────────────────────────────────────────
var lastTap = 0;
document.getElementById('palette').addEventListener('touchend', function(e) {
  if (e.target.closest('.lock-btn') || e.target.closest('.swatch-hex')) return;
  var now = Date.now();
  if (now - lastTap < 350) {
    e.preventDefault();
    regen();
  }
  lastTap = now;
});

// ─── Pix modal ───────────────────────────────────────────────────────────────
var pixOverlay = document.getElementById('pixOverlay');
var helpOverlay = document.getElementById('helpOverlay');

document.getElementById('pixBtn').addEventListener('click', function() {
  pixOverlay.classList.add('open');
});

document.getElementById('pixClose').addEventListener('click', function() {
  pixOverlay.classList.remove('open');
});

document.getElementById('helpBtn').addEventListener('click', function() {
  helpOverlay.classList.add('open');
});

document.getElementById('helpClose').addEventListener('click', function() {
  helpOverlay.classList.remove('open');
});

pixOverlay.addEventListener('click', function(e) {
  if (e.target === pixOverlay) pixOverlay.classList.remove('open');
});

helpOverlay.addEventListener('click', function(e) {
  if (e.target === helpOverlay) helpOverlay.classList.remove('open');
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    pixOverlay.classList.remove('open');
    helpOverlay.classList.remove('open');
  }
});



// ─── Init ─────────────────────────────────────────────────────────────────────
swatchBg.style.backgroundColor = baseColor;
colorPicker.value = baseColor;

updateLockIcon(document.getElementById('lockBtn60'), false);
updateLockIcon(document.getElementById('lockBtn30'), false);

// Logo começa com cores aleatórias; applyPalette vai sobrescrever com as cores reais
updateLogoColors(randomHex(), randomHex(), randomHex());

applyPalette(generatePalette(baseColor, { randomHarmony: true }), true);
updateLockStatus();
