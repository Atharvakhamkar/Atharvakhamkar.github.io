// Command-palette terminal. Opens with "/" or Ctrl/Cmd+K, closes with Esc.
import { links, experience, projects } from './data.js';
import { toast } from './effects.js';

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function initTerminal() {
  const overlay = document.getElementById('term');
  const body = document.getElementById('termBody');
  const form = document.getElementById('termForm');
  const input = document.getElementById('termIn');
  if (!overlay) return;

  const hist = [];
  let hi = 0;
  let greeted = false;
  let lastFocus = null;

  const out = (html) => {
    const d = document.createElement('div');
    d.className = 'ln';
    d.innerHTML = html;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  };
  const go = (id) => {
    close();
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 260);
  };

  const C = {
    help: () => [
      '<span class="y">available commands</span>',
      '  <span class="c">whoami</span>                    short intro',
      '  <span class="c">kubectl get experience</span>    work history',
      '  <span class="c">ls projects/</span>              all projects',
      '  <span class="c">cd &lt;section&gt;</span>              jump: about, experience, projects, skills, education, contact',
      '  <span class="c">resume</span>                    open the PDF',
      '  <span class="c">contact</span>                   email / linkedin / github',
      '  <span class="c">theme</span>                     toggle light/dark',
      '  <span class="c">clear</span> · <span class="c">exit</span>',
      '<span class="g">psst: try</span> <span class="c">sudo hire atharva</span>',
    ],
    whoami: () => [
      '<span class="p">Atharva Arun Khamkar</span> — DevOps &amp; Cloud Engineer',
      'MSc Advanced CS (Cloud Computing), University of Leeds',
      'Leeds, UK · open to graduate/junior DevOps, Cloud, Platform &amp; SRE roles',
    ],
    'kubectl get experience': () => [
      '<span class="g">NAME                          ROLE                         STATUS      AGE</span>',
      ...experience.map((j) => `${j.org.toLowerCase().replace(/[^a-z]+/g, '-').padEnd(30)}${j.role.split(' — ')[0].padEnd(29)}<span class="p">Completed</span>   ${j.duration}`),
      `${'your-company'.padEnd(30)}${'DevOps / Cloud / SRE'.padEnd(29)}<span class="y">Pending</span>     —`,
    ],
    'ls projects/': () => projects.map((p) => `<span class="c">${p.title.toLowerCase().split(/[—:]/)[0].trim().replace(/[^a-z0-9]+/g, '-')}/</span>  <span class="g">${p.meta}</span>`),
    contact: () => [
      `email     <a href="mailto:${links.email}">${links.email}</a>`,
      `linkedin  <a href="${links.linkedin}" target="_blank" rel="noopener">in/atharva-khamkar</a>`,
      `github    <a href="${links.github}" target="_blank" rel="noopener">Atharvakhamkar</a>`,
    ],
    resume: () => { window.open(links.resume, '_blank', 'noopener'); return ['opening <span class="c">resume.pdf</span> …']; },
    theme: () => { document.getElementById('themeBtn')?.click(); return ['theme toggled']; },
    'sudo hire atharva': () => {
      setTimeout(() => { go('contact'); toast('✓ permission granted — deploying Atharva to your team'); }, 500);
      return ['<span class="p">[sudo]</span> password for recruiter: ********', '<span class="p">✓</span> authenticated. rolling out…'];
    },
    'kubectl get pods': () => [
      '<span class="g">NAME                     READY   STATUS    RESTARTS</span>',
      'ci-cd-pipeline-7f9c      1/1     <span class="p">Running</span>   0',
      'kubehealer-agent-2b1d    1/1     <span class="p">Running</span>   3  <span class="g">(self-healed)</span>',
      'observability-9a1f       1/1     <span class="p">Running</span>   0',
    ],
    ls: () => ['<span class="c">projects/</span>  README.md  resume.pdf  skills.yaml'],
    pwd: () => ['/home/atharva/portfolio'],
    date: () => [new Date().toString()],
  };
  const alias = {
    experience: 'kubectl get experience', 'kubectl get exp': 'kubectl get experience',
    projects: 'ls projects/', 'ls projects': 'ls projects/', about: 'whoami', 'cat readme.md': 'whoami',
    'sudo hire-me': 'sudo hire atharva', hire: 'sudo hire atharva', 'sudo hire': 'sudo hire atharva',
  };
  const sections = { about: 'about', experience: 'experience', projects: 'projects', skills: 'skills', education: 'education', contact: 'contact', home: 'top', top: 'top', '~': 'top' };

  function run(raw) {
    const cmd = raw.trim().replace(/\s+/g, ' ');
    let k = cmd.toLowerCase();
    out(`<span class="p">$</span> ${esc(cmd)}`);
    if (!k) return;
    hist.push(cmd); hi = hist.length;
    if (k === 'clear') { body.innerHTML = ''; return; }
    if (k === 'exit' || k === 'q') { close(); return; }
    if (k.startsWith('cd ')) {
      const target = k.slice(3).replace(/[./]/g, '') || '~';
      if (sections[target]) { out(`<span class="g">→ /${target}</span>`); go(sections[target]); }
      else out(`<span class="r">cd: no such section:</span> ${esc(target)}`);
      return;
    }
    k = alias[k] || k;
    if (C[k]) C[k]().forEach(out);
    else out(`<span class="r">command not found:</span> ${esc(cmd.split(' ')[0])} <span class="g">— try</span> <span class="c">help</span>`);
    out('');
  }

  function open() {
    lastFocus = document.activeElement;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    if (!greeted) {
      greeted = true;
      ['<span class="g">atharva-shell 1.0 — type</span> <span class="c">help</span> <span class="g">for commands · Esc to close</span>', ''].forEach(out);
      run('whoami');
    }
    setTimeout(() => input.focus(), 60);
  }
  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    lastFocus?.focus?.();
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); run(input.value); input.value = ''; });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && hi > 0) { hi--; input.value = hist[hi]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; e.preventDefault(); }
  });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('[data-close]')?.addEventListener('click', close);
  overlay.querySelector('.term-chips')?.addEventListener('click', (e) => {
    const c = e.target.dataset?.cmd;
    if (c) { run(c); input.focus(); }
  });
  document.querySelectorAll('[data-open-term]').forEach((b) => b.addEventListener('click', open));

  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    if (e.key === 'Escape' && overlay.classList.contains('open')) { close(); return; }
    if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      overlay.classList.contains('open') ? close() : open();
    }
  });
}
