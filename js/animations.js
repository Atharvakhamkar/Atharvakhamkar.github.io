// Scroll choreography. Uses GSAP + ScrollTrigger when available; falls back to
// IntersectionObserver reveals so the page still works if the CDN is blocked.
import { countUp, setCount } from './effects.js';

/** Wrap each word of .statement in a span so it can light up on scroll. */
function splitStatement(el) {
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement('span');
          s.className = 'w' + (node.classList?.contains('hl') ? ' hl' : '');
          s.textContent = part;
          frag.appendChild(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el);
  // move .hl class down onto the generated word spans, then unwrap the .hl wrapper
  el.querySelectorAll('span.hl:not(.w)').forEach((wrap) => {
    wrap.querySelectorAll('.w').forEach((w) => w.classList.add('hl'));
    wrap.replaceWith(...wrap.childNodes);
  });
  return [...el.querySelectorAll('.w')];
}

export function initAnimations({ reduced, onFeature }) {
  const root = document.documentElement;
  const statement = document.querySelector('.statement');
  const words = statement ? splitStatement(statement) : [];
  const metrics = [...document.querySelectorAll('[data-count]')];
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;

  // ---- no-motion or no-GSAP fallback ----------------------------------
  if (reduced || !gsap || !ST) {
    root.classList.add(reduced ? 'no-motion' : 'no-gsap');
    root.classList.remove('motion');
    words.forEach((w) => w.classList.add('on'));
    metrics.forEach((m) => { setCount(m); m.closest('.metric')?.style.setProperty('--p', 1); });
    document.querySelectorAll('.job').forEach((j) => j.classList.add('lit'));
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      if (e.target.id === 'viz') onFeature();
      io.unobserve(e.target);
    }), { threshold: 0.2 });
    const viz = document.getElementById('viz');
    if (viz) io.observe(viz);
    return;
  }

  gsap.registerPlugin(ST);
  gsap.defaults({ ease: 'power3.out' });

  // ---- hero entrance ----------------------------------------------------
  const tl = gsap.timeline({ delay: 0.1 });
  tl.from('.hero .pill', { y: 16, opacity: 0, duration: 0.6 })
    .from('.hero h1 .line', { yPercent: 40, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.3')
    .from('.hero .role, .hero .lede', { y: 18, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.5')
    .from('.hero .cta .btn', { y: 14, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.4')
    .from('.hero-meta > *', { opacity: 0, duration: 0.6, stagger: 0.06 }, '-=0.2')
    .from('#cluster', { opacity: 0, scale: 0.85, duration: 1.6, ease: 'power2.out' }, 0);

  // hero parallax out
  gsap.to('.hero .wrap', {
    yPercent: -12, opacity: 0.25, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('#cluster', {
    yPercent: 18, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  // ---- section headings -------------------------------------------------
  gsap.utils.toArray('.sec-head').forEach((h) => {
    gsap.from(h.children, {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.08,
      scrollTrigger: { trigger: h, start: 'top 85%' },
    });
  });

  // ---- statement: words light up as you scroll --------------------------
  if (words.length) {
    ST.create({
      trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: (self) => {
        const n = Math.round(self.progress * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i < n));
      },
    });
  }

  // ---- metrics count up -------------------------------------------------
  ST.create({
    trigger: '.metrics', start: 'top 85%', once: true,
    onEnter: () => {
      gsap.from('.metric', { y: 30, opacity: 0, duration: 0.7, stagger: 0.1 });
      metrics.forEach((m) => countUp(m));
      document.querySelectorAll('.metric').forEach((m) => m.style.setProperty('--p', 1));
    },
  });

  // ---- generic batch reveals -------------------------------------------
  gsap.set('[data-anim]', { opacity: 0, y: 34 });
  ST.batch('[data-anim]', {
    start: 'top 88%',
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.09, overwrite: true, clearProps: 'transform' }),
  });

  // ---- experience: timeline draws, dots light, log steps stream in ------
  gsap.to('.tl-fill', {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.timeline', start: 'top 65%', end: 'bottom 60%', scrub: true },
  });
  gsap.utils.toArray('.job').forEach((job) => {
    ST.create({
      trigger: job, start: 'top 65%',
      onEnter: () => job.classList.add('lit'),
      onLeaveBack: () => job.classList.remove('lit'),
    });
    gsap.from(job.querySelectorAll('[data-step]'), {
      x: -14, opacity: 0, duration: 0.5, stagger: 0.12,
      scrollTrigger: { trigger: job, start: 'top 70%' },
    });
  });

  // ---- dissertation visualiser ----------------------------------------
  ST.create({ trigger: '#viz', start: 'top 75%', once: true, onEnter: onFeature });

  // ---- contact: big headline rises -------------------------------------
  gsap.from('.mon-body h2', {
    yPercent: 30, opacity: 0, duration: 1,
    scrollTrigger: { trigger: '.monitor', start: 'top 75%' },
  });

  // recalc once images/fonts settle
  window.addEventListener('load', () => ST.refresh());
}

/** Fade/slide in the cards that remain after a project filter change. */
export function animateFilter(cards) {
  const gsap = window.gsap;
  if (!gsap) { cards.forEach((c) => { c.style.opacity = 1; }); return; }
  gsap.fromTo(cards, { opacity: 0, y: 20, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.05, overwrite: true, clearProps: 'transform' });
}
