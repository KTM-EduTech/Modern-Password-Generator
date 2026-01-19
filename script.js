// Character sets
const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?/`~'
};

// UI elements
const lengthRange    = document.getElementById('length');
const lengthVal      = document.getElementById('lengthVal');
const passwordEl     = document.getElementById('password');
const generateBtn    = document.getElementById('generateBtn');
const generateBtn2   = document.getElementById('generateBtn2');
const copyBtn        = document.getElementById('copyBtn');
const copyBtn2       = document.getElementById('copyBtn2');
const meterFill      = document.getElementById('meterFill');
const strengthText   = document.getElementById('strengthText');
const entropyEl      = document.getElementById('entropy');
const charsetSizeEl  = document.getElementById('charsetSize');

const upper    = document.getElementById('upper');
const lower    = document.getElementById('lower');
const numbers  = document.getElementById('numbers');
const symbols  = document.getElementById('symbols');
const noSimilar = document.getElementById('noSimilar');

function updateLengthUI() {
  lengthVal.textContent = lengthRange.value;
}

lengthRange.addEventListener('input', () => {
  updateLengthUI();
  updatePreviewStats();
});

// Secure random integer using Web Crypto API
function secureRandomInt(max) {
  const uint32 = crypto.getRandomValues(new Uint32Array(1))[0];
  return Math.floor(uint32 / 0x100000000 * max);
}

function buildCharset() {
  let chars = '';
  if (upper.checked)    chars += SETS.upper;
  if (lower.checked)    chars += SETS.lower;
  if (numbers.checked)  chars += SETS.numbers;
  if (symbols.checked)  chars += SETS.symbols;

  if (noSimilar.checked) {
    chars = chars.replace(/[il1Lo0O]/g, '');
  }
  return chars;
}

function generatePassword(len) {
  const chars = buildCharset();
  if (!chars) return '';

  const out = [];

  // Collect active character sets (for guaranteed inclusion)
  const activeTypes = [];
  if (upper.checked)    activeTypes.push(SETS.upper);
  if (lower.checked)    activeTypes.push(SETS.lower);
  if (numbers.checked)  activeTypes.push(SETS.numbers);
  if (symbols.checked)  activeTypes.push(SETS.symbols);

  if (noSimilar.checked) {
    for (let i = 0; i < activeTypes.length; i++) {
      activeTypes[i] = activeTypes[i].replace(/[il1Lo0O]/g, '');
    }
  }

  // Guarantee at least one character from each selected type (if possible)
  const reserve = Math.min(len, activeTypes.length);
  for (let i = 0; i < reserve; i++) {
    const set = activeTypes[i];
    if (set && set.length > 0) {
      out.push(set[secureRandomInt(set.length)]);
    }
  }

  // Fill remaining positions
  for (let i = out.length; i < len; i++) {
    out.push(chars[secureRandomInt(chars.length)]);
  }

  // Fisher-Yates shuffle
  for (let i = out.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out.join('');
}

function estimateEntropy(len, charsetSize) {
  if (charsetSize <= 0) return 0;
  return len * Math.log2(charsetSize);
}

function updatePreviewStats() {
  const chars = buildCharset();
  const charsetSize = chars.length;
  const len = Number(lengthRange.value);
  const entropy = estimateEntropy(len, charsetSize);

  charsetSizeEl.textContent = charsetSize + ' characters';
  entropyEl.textContent = entropy > 0 ? entropy.toFixed(1) + ' bits' : '— bits';

  // Strength meter percentage (capped at 128 bits)
  let pct = Math.min(100, Math.round((entropy / 128) * 100));
  meterFill.style.width = pct + '%';

  let label = '—';
  if      (entropy <= 28)  label = 'Very weak';
  else if (entropy <= 35)  label = 'Weak';
  else if (entropy <= 59)  label = 'Moderate';
  else if (entropy <= 127) label = 'Strong';
  else                     label = 'Very strong';

  strengthText.textContent = label;

  // Color gradient based on strength
  if      (pct < 25) meterFill.style.background = 'linear-gradient(90deg, #ff6b6b, #ff9b6b)';
  else if (pct < 50) meterFill.style.background = 'linear-gradient(90deg, #ffb347, #ffd56b)';
  else if (pct < 75) meterFill.style.background = 'linear-gradient(90deg, #7bd389, #ffd56b)';
  else               meterFill.style.background = 'linear-gradient(90deg, #7bd389, #06b6d4)';
}

function showPassword(pw) {
  passwordEl.textContent = pw || '—';
}

function generateAndUpdate() {
  const len = Number(lengthRange.value);
  const pw = generatePassword(len);
  showPassword(pw);
  updatePreviewStats();
}

// Event listeners
generateBtn.addEventListener('click', generateAndUpdate);
generateBtn2.addEventListener('click', generateAndUpdate);

copyBtn.addEventListener('click', async () => {
  const txt = passwordEl.textContent;
  if (!txt || txt === '—') return;

  try {
    await navigator.clipboard.writeText(txt);
    copyBtn.textContent = 'Copied';
    setTimeout(() => copyBtn.textContent = 'Copy', 1200);
  } catch (err) {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = txt;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      copyBtn.textContent = 'Copied';
      setTimeout(() => copyBtn.textContent = 'Copy', 1200);
    } catch (e) {}
    ta.remove();
  }
});

copyBtn2.addEventListener('click', () => copyBtn.click());

// Update stats when toggling character type options
[upper, lower, numbers, symbols, noSimilar].forEach(el => {
  el.addEventListener('change', updatePreviewStats);
});

// Initialize
updateLengthUI();
updatePreviewStats();
generateAndUpdate();
