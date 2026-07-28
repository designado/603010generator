// ─── Color utilities ──────────────────────────────────────────────────────────

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  let l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = x => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function textColor(hex) {
  return luminance(hex) > 0.35 ? 'rgba(0,0,0,0.78)' : 'rgba(255,255,255,0.92)';
}

// ─── Harmony generators ───────────────────────────────────────────────────────

function jitter(val, range) {
  return val + (Math.random() - 0.5) * range;
}

var harmonies = [
  {
    name: 'Análoga',
    generate: function(h, s, l) {
      var shift1 = jitter(30, 15);
      var shift2 = jitter(60, 15);
      var h30 = h + shift1;
      var s30 = jitter(s * 0.85, 10);
      var l30 = jitter(l > 50 ? l - 18 : l + 18, 8);
      var h60 = h + shift2;
      var s60 = jitter(s * 0.45, 10);
      var l60 = l > 50 ? jitter(16, 6) : jitter(88, 6);
      return { c30: hslToHex(h30, s30, l30), c60: hslToHex(h60, s60, l60) };
    }
  },
  {
    name: 'Complementar Split',
    generate: function(h, s, l) {
      var comp = h + 180;
      var split1 = comp + jitter(25, 10);
      var split2 = comp - jitter(25, 10);
      var s30 = jitter(s * 0.75, 10);
      var l30 = jitter(l > 50 ? l - 15 : l + 15, 8);
      var s60 = jitter(s * 0.3, 8);
      var l60 = l > 50 ? jitter(14, 5) : jitter(90, 5);
      return { c30: hslToHex(split1, s30, l30), c60: hslToHex(split2, s60, l60) };
    }
  },
  {
    name: 'Tríade',
    generate: function(h, s, l) {
      var h30 = h + 120 + jitter(0, 12);
      var h60 = h + 240 + jitter(0, 12);
      var s30 = jitter(s * 0.8, 10);
      var l30 = jitter(l > 50 ? l - 12 : l + 12, 8);
      var s60 = jitter(s * 0.28, 8);
      var l60 = l > 50 ? jitter(13, 5) : jitter(92, 5);
      return { c30: hslToHex(h30, s30, l30), c60: hslToHex(h60, s60, l60) };
    }
  },
  {
    name: 'Monocromática',
    generate: function(h, s, l) {
      var s30 = jitter(s * 0.7, 8);
      var l30 = jitter(l > 50 ? l - 22 : l + 22, 6);
      var s60 = jitter(s * 0.12, 5);
      var l60 = l > 50 ? jitter(11, 5) : jitter(92, 5);
      return { c30: hslToHex(h, s30, l30), c60: hslToHex(h, s60, l60) };
    }
  },
  {
    name: 'Complementar',
    generate: function(h, s, l) {
      var h30 = h + 180 + jitter(0, 8);
      var s30 = jitter(s * 0.8, 10);
      var l30 = jitter(l > 50 ? l - 16 : l + 16, 8);
      var s60 = jitter(s * 0.22, 8);
      var l60 = l > 50 ? jitter(12, 5) : jitter(91, 5);
      return { c30: hslToHex(h30, s30, l30), c60: hslToHex(h, s60, l60) };
    }
  }
];

var currentHarmonyIndex = 0;

function generatePalette(baseHex, options) {
  options = options || {};
  var randomHarmony  = options.randomHarmony !== false;
  var locked         = options.locked || {};
  var currentPalette = options.currentPalette || {};

  var hsl = hexToHsl(baseHex);
  var h = hsl[0], s = hsl[1], l = hsl[2];

  if (randomHarmony) {
    currentHarmonyIndex = Math.floor(Math.random() * harmonies.length);
  }

  var harmony   = harmonies[currentHarmonyIndex];
  var generated = harmony.generate(h, s, l);

  return {
    c10: baseHex,
    c30: locked.c30 ? currentPalette.c30 : generated.c30,
    c60: locked.c60 ? currentPalette.c60 : generated.c60,
    harmonyName: harmony.name
  };
}
