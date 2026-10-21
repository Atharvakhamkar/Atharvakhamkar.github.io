// Dissertation visualiser: 12 worker tiles + speed-up readout for the measured points (1, 2, 12 workers)
import { scaling } from './data.js';

export function initScalingViz({ reduced = false } = {}) {
  const root = document.getElementById('viz');
  if (!root) return { start() {} };
  const tiles = root.querySelector('.workers');
  const read = root.querySelector('.viz-read');
  const ctrl = root.querySelector('.viz-ctrl');
  const maxW = Math.max(...scaling.map((s) => s.workers));
  const maxS = Math.max(...scaling.map((s) => s.speedup));

  tiles.innerHTML = Array.from({ length: maxW }, (_, i) => `<div class="worker" style="--d:${(i % 6) * 0.12}s">w${i + 1}</div>`).join('');
  ctrl.innerHTML = scaling.map((s, i) => `<button type="button" data-i="${i}">${s.workers}w</button>`).join('');
  root.querySelector('.bars').innerHTML = scaling
    .map((s) => `<div class="brow"><span>${s.workers} worker${s.workers > 1 ? 's' : ''}</span><div class="track"><div class="fill" data-w="${(s.speedup / maxS) * 100}"></div></div><span class="v">${s.speedup.toFixed(2)}×</span></div>`)
    .join('');

  const workerEls = [...tiles.children];
  const btns = [...ctrl.children];
  let cur = -1, shown = 0, timer = null, raf = 0;

  function animateRead(to) {
    cancelAnimationFrame(raf);
    const from = shown, t0 = performance.now(), d = reduced ? 1 : 700;
    const f = (now) => {
      const p = Math.min((now - t0) / d, 1), e = 1 - Math.pow(1 - p, 3);
      shown = from + (to - from) * e;
      read.innerHTML = `${shown.toFixed(2)}<small>×</small>`;
      if (p < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
  }

  function show(i) {
    cur = i;
    const s = scaling[i];
    workerEls.forEach((w, k) => w.classList.toggle('on', k < s.workers));
    btns.forEach((b, k) => b.classList.toggle('on', k === i));
    animateRead(s.speedup);
  }

  function auto() {
    clearInterval(timer);
    if (reduced) return;
    timer = setInterval(() => show((cur + 1) % scaling.length), 2600);
  }

  ctrl.addEventListener('click', (e) => {
    const i = e.target.dataset?.i;
    if (i === undefined) return;
    show(+i);
    clearInterval(timer); // user took control
  });

  return {
    start() {
      root.querySelectorAll('.fill').forEach((f) => { f.style.width = f.dataset.w + '%'; });
      show(0);
      setTimeout(() => { show(1); auto(); }, reduced ? 0 : 900);
    },
  };
}
