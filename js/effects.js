// Small interaction effects: text scramble, rotating words, card tilt, magnetic buttons, counters, toast

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Decode `text` into `el` with a random-glyph scramble. Resolves when done. */
export function scramble(el, text = el.textContent, { duration = 900 } = {}) {
  return new Promise((resolve) => {
    const from = el.textContent;
    const len = Math.max(from.length, text.length);
    const queue = [];
    for (let i = 0; i < len; i++) {
      const start = Math.floor(Math.random() * (duration * 0.4));
      const end = start + Math.floor(Math.random() * (duration * 0.6));
      queue.push({ from: from[i] || '', to: text[i] || '', start, end });
    }
    const t0 = performance.now();
    function frame(now) {
      const t = now - t0;
      let out = '', done = 0;
      for (const q of queue) {
        if (t >= q.end) { done++; out += q.to; }
        else if (t >= q.start) out += `<span class="dim">${GLYPHS[Math.floor(Math.random() * GLYPHS.length)]}</span>`;
        else out += q.from;
      }
      el.innerHTML = out;
      if (done === queue.length) resolve();
      else requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

/** Cycle through words in `el`, scrambling between them. */
export function rotateWords(el, words, { every = 2600, reduced = false } = {}) {
  if (!el || !words.length) return;
  let i = 0;
  el.textContent = words[0];
  if (reduced) return;
  setInterval(() => {
    i = (i + 1) % words.length;
    scramble(el, words[i], { duration: 700 });
  }, every);
}

/** 3D tilt + cursor spotlight on cards (pointer devices only). */
export function tilt(cards, { max = 6 } = {}) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.classList.add('tilting');
      card.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`);
      card.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`);
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/** Buttons that lean towards the cursor. */
export function magnetic(els, { strength = 0.28 } = {}) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  els.forEach((el) => {
    el.style.transition = 'transform .35s cubic-bezier(.2,.8,.2,1), border-color .2s, box-shadow .3s, background-color .2s';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/** Animate a number from 0 to data-count; keeps the <small> suffix. */
export function countUp(el, { duration = 1400 } = {}) {
  const target = parseFloat(el.dataset.count);
  const dec = parseInt(el.dataset.dec || '0', 10);
  const suffix = el.querySelector('small')?.outerHTML || '';
  const t0 = performance.now();
  function f(now) {
    const p = Math.min((now - t0) / duration, 1);
    const e = 1 - Math.pow(1 - p, 4);
    el.innerHTML = (target * e).toFixed(dec) + suffix;
    if (p < 1) requestAnimationFrame(f);
  }
  requestAnimationFrame(f);
}

export function setCount(el) {
  const suffix = el.querySelector('small')?.outerHTML || '';
  el.innerHTML = parseFloat(el.dataset.count).toFixed(parseInt(el.dataset.dec || '0', 10)) + suffix;
}

let toastTimer;
export function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
