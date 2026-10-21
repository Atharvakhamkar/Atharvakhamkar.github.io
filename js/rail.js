// Pipeline rail: each section is a stage. Stages above the viewport are "done",
// the one in view is "running", the rest are pending. Also drives the top progress bar.

export function initRail() {
  const items = [...document.querySelectorAll('.rail li')];
  const fill = document.querySelector('.rail-fill');
  const progress = document.querySelector('.bar-progress');
  const runLabel = document.querySelector('#runLabel');
  const run = document.querySelector('.bar-run');
  const stages = items.map((li) => {
    const id = li.querySelector('a').getAttribute('href').slice(1);
    return { li, el: document.getElementById(id), name: li.dataset.stage };
  }).filter((s) => s.el);

  let ticking = false;
  function update() {
    ticking = false;
    const y = window.scrollY + window.innerHeight * 0.45;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const atEnd = window.scrollY >= max - 4;
    let cur = 0;
    stages.forEach((s, i) => { if (s.el.offsetTop <= y) cur = i; });
    if (atEnd) cur = stages.length - 1;

    stages.forEach((s, i) => {
      s.li.classList.toggle('done', i < cur || (atEnd && i === cur));
      s.li.classList.toggle('run', i === cur && !atEnd);
    });

    const frac = stages.length > 1 ? cur / (stages.length - 1) : 0;
    if (fill) fill.style.transform = `scaleY(${frac})`;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    if (runLabel) {
      runLabel.textContent = atEnd
        ? `pipeline #57 · succeeded`
        : `stage ${cur + 1}/${stages.length} · ${stages[cur].name} · running`;
    }
    run?.classList.toggle('ok', atEnd);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
