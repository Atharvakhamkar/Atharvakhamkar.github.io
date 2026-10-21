// Rotating 3D "Kubernetes cluster" on a 2D canvas.
// Pods sit on a Fibonacci sphere, linked to their nearest neighbours. Packets of traffic
// hop between pods; every few seconds a pod crashes (red) and self-heals with a ring pulse.

const TAU = Math.PI * 2;

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function initCluster(canvas, { reduced = false } = {}) {
  if (!canvas || !canvas.getContext) return () => {};
  const ctx = canvas.getContext('2d');
  const N = window.innerWidth < 760 ? 70 : 110;
  const K = 3; // neighbours per pod

  // --- geometry -----------------------------------------------------------
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push({
      x: Math.cos(th) * r, y, z: Math.sin(th) * r,
      kind: Math.random() < 0.18 ? 'cyan' : 'accent',
      crash: 0,  // 1 → fully crashed, decays to 0 while healing
      ring: 0,   // heal pulse 0..1
      sx: 0, sy: 0, sz: 0, s: 1,
    });
  }
  const edges = [];
  const adj = pts.map(() => []);
  pts.forEach((p, i) => {
    const near = pts
      .map((q, j) => [j, (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2])
      .filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1])
      .slice(0, K);
    near.forEach(([j]) => {
      if (!adj[i].includes(j)) {
        adj[i].push(j); adj[j].push(i);
        edges.push([i, j]);
      }
    });
  });

  const packets = Array.from({ length: Math.round(N * 0.35) }, () => {
    const a = Math.floor(Math.random() * N);
    return { a, b: adj[a][Math.floor(Math.random() * adj[a].length)], t: Math.random(), v: 0.006 + Math.random() * 0.01 };
  });

  // --- colours (re-read on theme change) ---------------------------------
  let C = {};
  function readColors() {
    C = {
      accent: hexToRgb(cssVar('--accent') || '#b8f35a'),
      cyan: hexToRgb(cssVar('--cyan') || '#5ad1f3'),
      red: hexToRgb(cssVar('--red') || '#ff6b57'),
      line: hexToRgb(cssVar('--ink-3') || '#66727f'),
      light: document.documentElement.dataset.theme === 'light',
    };
  }
  readColors();
  const mo = new MutationObserver(() => { readColors(); if (reduced) draw(16); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  // --- sizing -------------------------------------------------------------
  let W = 0, H = 0, R = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = Math.min(W, H) * 0.42;
  }
  resize();
  window.addEventListener('resize', resize);

  // --- interaction --------------------------------------------------------
  let rotY = 0, rotX = -0.25, tgtX = -0.25, tgtY = 0, drift = 0;
  function onMove(e) {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    tgtY = nx * 0.9; tgtX = -0.25 + ny * 0.5;
  }
  window.addEventListener('pointermove', onMove, { passive: true });

  // --- frame --------------------------------------------------------------
  let crashTimer = 0, last = performance.now(), running = true, raf = 0;

  function project(p) {
    const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
    let x = p.x * cy - p.z * sy;
    let z = p.x * sy + p.z * cy;
    let y = p.y * cx - z * sx;
    z = p.y * sx + z * cx;
    const persp = 2.6 / (2.6 + z);
    p.sx = W / 2 + x * R * persp;
    p.sy = H / 2 + y * R * persp;
    p.sz = z; p.s = persp;
  }

  function draw(dt) {
    ctx.clearRect(0, 0, W, H);
    const step = Math.min(dt / 16.67, 3);

    drift += 0.0016 * step;
    rotY += ((tgtY + drift) - rotY) * 0.04 * step;
    rotX += (tgtX - rotX) * 0.04 * step;
    pts.forEach(project);

    // edges, back to front by depth alpha
    const baseA = C.light ? 0.22 : 0.16;
    ctx.lineWidth = 1;
    for (const [i, j] of edges) {
      const a = pts[i], b = pts[j];
      const depth = (2 - (a.sz + b.sz)) / 4; // 0 (back) .. 1 (front)
      ctx.strokeStyle = rgba(C.line, baseA * (0.25 + depth));
      ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
    }

    // packets
    for (const pk of packets) {
      pk.t += pk.v * step;
      if (pk.t >= 1) {
        pk.a = pk.b; pk.t = 0;
        const opts = adj[pk.a];
        pk.b = opts[Math.floor(Math.random() * opts.length)];
      }
      const a = pts[pk.a], b = pts[pk.b];
      const x = a.sx + (b.sx - a.sx) * pk.t, y = a.sy + (b.sy - a.sy) * pk.t;
      const depth = (2 - (a.sz + b.sz)) / 4;
      ctx.fillStyle = rgba(C.cyan, 0.35 + depth * 0.6);
      ctx.beginPath(); ctx.arc(x, y, 1.2 + depth * 1.4, 0, TAU); ctx.fill();
    }

    // crash / heal cycle
    crashTimer += dt;
    if (crashTimer > 1800) {
      crashTimer = 0;
      const p = pts[Math.floor(Math.random() * N)];
      if (p.sz < 0.2) p.crash = 1;
    }

    // pods (sort for proper overlap)
    const order = pts.slice().sort((a, b) => b.sz - a.sz);
    for (const p of order) {
      const depth = (1 - p.sz) / 2;
      const r = (1.1 + depth * 2.1) * p.s;
      let col = p.kind === 'cyan' ? C.cyan : C.accent;
      if (p.crash > 0) {
        p.crash -= 0.004 * step;
        if (p.crash > 0.35) col = C.red;
        if (p.crash <= 0.35 && p.ring === 0) p.ring = 0.0001;
        if (p.crash < 0) p.crash = 0;
      }
      const alpha = 0.25 + depth * 0.75;
      if (depth > 0.7 || col === C.red) {
        ctx.fillStyle = rgba(col, alpha * (col === C.red ? 0.28 : 0.12));
        ctx.beginPath(); ctx.arc(p.sx, p.sy, r * 3.2, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = rgba(col, alpha);
      ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, TAU); ctx.fill();

      if (p.ring > 0) {
        p.ring += 0.02 * step;
        ctx.strokeStyle = rgba(C.accent, Math.max(0, 1 - p.ring) * 0.9);
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, r + p.ring * 26, 0, TAU); ctx.stroke();
        if (p.ring >= 1) p.ring = 0;
      }
    }
  }

  function loop(now) {
    const dt = now - last; last = now;
    if (running) draw(dt);
    raf = requestAnimationFrame(loop);
  }

  if (reduced) {
    draw(16);
  } else {
    raf = requestAnimationFrame(loop);
    // pause when off-screen or tab hidden
    const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; last = performance.now(); });
    io.observe(canvas);
    document.addEventListener('visibilitychange', () => { running = !document.hidden; last = performance.now(); });
  }

  return () => {
    cancelAnimationFrame(raf);
    mo.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onMove);
  };
}
