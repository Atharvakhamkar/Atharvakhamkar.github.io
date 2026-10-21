// Entry point — wires everything together.
import { renderAll } from './render.js';
import { initCluster } from './cluster.js';
import { scramble, rotateWords, tilt, magnetic } from './effects.js';
import { initRail } from './rail.js';
import { initTerminal } from './terminal.js';
import { initScalingViz } from './viz.js';
import { initAnimations, animateFilter } from './animations.js';
import { runBoot } from './boot.js';

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js');
if (!reduced) root.classList.add('motion');

// ---------- theme ----------
document.getElementById('themeBtn')?.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
});

// ---------- mobile menu ----------
const mnav = document.getElementById('mnav');
document.getElementById('menuBtn')?.addEventListener('click', (e) => {
  const open = mnav.classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', open);
});
mnav?.addEventListener('click', (e) => { if (e.target.closest('a')) mnav.classList.remove('open'); });

// ---------- content ----------
renderAll();
document.getElementById('yr').textContent = new Date().getFullYear();

// ---------- project filters ----------
const cards = [...document.querySelectorAll('#grid .card')];
document.getElementById('filters')?.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const f = btn.dataset.f;
  btn.parentElement.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === btn));
  const visible = [];
  cards.forEach((c) => {
    const show = f === 'all' || c.dataset.filters.split(' ').includes(f);
    c.classList.toggle('hide', !show);
    if (show) visible.push(c);
  });
  animateFilter(visible);
  window.ScrollTrigger?.refresh();
});

// ---------- always-on interactions ----------
initRail();
initTerminal();
tilt(cards);
magnetic([...document.querySelectorAll('.btn')]);
initCluster(document.getElementById('cluster'), { reduced });
const viz = initScalingViz({ reduced });

// ---------- boot, then choreography ----------
runBoot({ reduced }).then(() => {
  initAnimations({ reduced, onFeature: () => viz.start() });
  if (!reduced) {
    document.querySelectorAll('[data-scramble]').forEach((el, i) => {
      const text = el.textContent;
      setTimeout(() => scramble(el, text, { duration: 1100 }), 250 + i * 180);
    });
  }
  rotateWords(document.getElementById('roleWord'), ['DevOps Engineer', 'Cloud Engineer', 'Platform Engineer', 'Site Reliability Eng.'], { reduced });
});
