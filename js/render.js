// Builds the data-driven sections (experience, projects, skills, education) from data.js
import { experience, projects, filters, moreRepos, skills, marquee, education } from './data.js';

const $ = (sel) => document.querySelector(sel);
const tags = (list) => `<div class="tags">${list.map((t) => `<span class="tag">${t}</span>`).join('')}</div>`;
const linksRow = (list) =>
  list.length
    ? `<div class="links-row">${list.map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener">${label}</a>`).join('')}</div>`
    : '';

function renderExperience() {
  const el = $('#jobs');
  if (!el) return;
  el.innerHTML = experience
    .map(
      (job, i) => `
    <article class="job" data-anim>
      <span class="job-dot" aria-hidden="true"></span>
      <div class="panel job-card">
        <header class="job-head">
          <span class="badge">✓ PASSED</span>
          <div>
            <h3 class="job-title">${job.role}</h3>
            <div class="job-org">${job.org} · ${job.place}</div>
          </div>
          <div class="job-when">${job.when}<br><span class="dim">job #${experience.length - i} · ${job.duration}</span></div>
        </header>
        <div class="job-log">
          ${job.steps
            .map((s, k) => `<div class="step" data-step><span class="t">step ${String(k + 1).padStart(2, '0')}</span><span class="k">✓</span><span>${s}</span></div>`)
            .join('')}
          ${tags(job.tags)}
        </div>
      </div>
    </article>`
    )
    .join('');
}

function renderProjects() {
  const grid = $('#grid');
  const bar = $('#filters');
  if (!grid || !bar) return;

  grid.innerHTML = projects
    .map(
      (p) => `
    <article class="panel card" data-filters="${p.filters.join(' ')}" data-anim>
      ${p.img ? `<div class="card-img"><img src="${p.img}" alt="${p.imgAlt}" loading="lazy" width="1024" height="768"></div>` : ''}
      <div class="card-in">
        <div class="card-top"><span class="st">${p.status}</span><span>${p.meta}</span></div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        ${p.win ? `<div class="win">${p.win}</div>` : ''}
        ${tags(p.tags)}
        ${linksRow(p.links)}
      </div>
    </article>`
    )
    .join('');

  bar.innerHTML = filters
    .map(([key, label]) => {
      const n = key === 'all' ? projects.length : projects.filter((p) => p.filters.includes(key)).length;
      return `<button type="button" data-f="${key}" class="${key === 'all' ? 'on' : ''}">${label}<span class="count">${n}</span></button>`;
    })
    .join('');

  const more = $('#repoList');
  if (more) {
    more.innerHTML = moreRepos
      .map((r) => `<a href="${r.url}" target="_blank" rel="noopener">${r.name} <span>${r.note}</span></a>`)
      .join('');
  }
}

function renderSkills() {
  const rows = document.querySelectorAll('[data-marquee]');
  rows.forEach((row, i) => {
    const items = marquee[i] || [];
    // duplicated once so the -50% translate loops seamlessly
    const chips = items.map(([label, c]) => `<span class="chip" style="--c: var(${c})"><i></i>${label}</span>`).join('');
    row.querySelector('.marquee-track').innerHTML = chips + chips;
  });

  const el = $('#manifests');
  if (!el) return;
  el.innerHTML = Object.entries(skills)
    .map(
      ([key, g]) => `
    <div class="panel manifest" data-anim>
      <span class="key">${key}:</span> <span class="cm"># ${g.note}</span>
      <ul>${g.items.map((s) => `<li>${s}</li>`).join('')}</ul>
    </div>`
    )
    .join('');
}

function renderEducation() {
  const el = $('#releases');
  if (!el) return;
  el.innerHTML = education
    .map(
      (e) => `
    <article class="panel release" data-anim>
      <div class="ver"><b>${e.ver}</b><span>${e.when}</span></div>
      <h3>${e.title}</h3>
      <p>${e.where}</p>
      <ul>${e.notes.map((n) => `<li>${n}</li>`).join('')}</ul>
    </article>`
    )
    .join('');
}

export function renderAll() {
  renderExperience();
  renderProjects();
  renderSkills();
  renderEducation();
}
