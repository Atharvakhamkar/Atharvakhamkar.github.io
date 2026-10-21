// "docker build"-style boot screen. Shown once per browser session; click or any key skips it.

const LINES = [
  ['h', '$ docker build -t atharva/portfolio:latest .'],
  ['', '[+] Building 2.1s (7/7) FINISHED'],
  ['', ' => [1/6] FROM leeds/msc-cloud-computing:2026'],
  ['', ' => [2/6] COPY ./experience ./internships'],
  ['', ' => [3/6] RUN jenkins && sonarqube --quality-gate'],
  ['', ' => [4/6] RUN docker build --multi-stage   # -60% size'],
  ['', ' => [5/6] RUN kubectl apply -f k8s/'],
  ['', ' => [6/6] RUN terraform apply -auto-approve'],
  ['s', ' ✓ naming to docker.io/atharva/portfolio:latest'],
];

export function runBoot({ reduced }) {
  const el = document.getElementById('boot');
  if (!el) return Promise.resolve();

  let seen = false;
  try { seen = sessionStorage.getItem('booted') === '1'; } catch (e) { /* storage blocked */ }
  if (reduced || seen) { el.remove(); return Promise.resolve(); }

  const log = el.querySelector('.boot-log');
  const bar = el.querySelector('.boot-bar i');
  document.body.style.overflow = 'hidden';

  return new Promise((resolve) => {
    let i = 0, timer, finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      try { sessionStorage.setItem('booted', '1'); } catch (e) { /* ignore */ }
      el.classList.add('done');
      document.body.style.overflow = '';
      window.removeEventListener('keydown', finish);
      el.removeEventListener('click', finish);
      setTimeout(() => el.remove(), 700);
      resolve();
    }
    function next() {
      if (i >= LINES.length) { timer = setTimeout(finish, 380); return; }
      const [cls, text] = LINES[i++];
      const d = document.createElement('div');
      if (cls) d.className = cls;
      d.textContent = text;
      log.appendChild(d);
      bar.style.width = `${(i / LINES.length) * 100}%`;
      timer = setTimeout(next, i === 1 ? 380 : 150);
    }
    window.addEventListener('keydown', finish);
    el.addEventListener('click', finish);
    next();
  });
}
