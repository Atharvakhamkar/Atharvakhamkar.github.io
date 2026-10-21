# Atharva Khamkar — Portfolio

Live: https://atharvakhamkar.github.io/

A static site (no build step) where the page *is* a deployment pipeline: scrolling runs
`checkout → build → test → package → scan → release → monitor`.

```
index.html          page shell + static sections
404.html            "CrashLoopBackOff" not-found page
css/
  tokens.css        colours, fonts, light/dark themes
  base.css          reset, layout, buttons, tags
  components.css    boot loader, top bar, pipeline rail, terminal overlay
  sections.css      hero, about, experience, projects, skills, education, contact
js/
  data.js           ALL content (jobs, projects, skills, education) — edit this to update the site
  main.js           entry point
  render.js         builds sections from data.js
  cluster.js        3D self-healing Kubernetes cluster (canvas)
  animations.js     GSAP ScrollTrigger choreography (falls back gracefully without GSAP)
  rail.js           pipeline stage rail + progress bar
  terminal.js       command-palette terminal (press / or Ctrl+K)
  viz.js            dissertation worker / speed-up visualiser
  effects.js        text scramble, card tilt, magnetic buttons, counters
  boot.js           docker-build boot screen (once per session)
assets/             resume PDF, project diagrams, favicon
```

Run locally (ES modules need a server, not file://):

```bash
python -m http.server 8000
```
