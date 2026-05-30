// js/main.js — It's Wesus Landing Page

(function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════════════
     1. NAVBAR — scroll-triggered glass effect
  ══════════════════════════════════════════════════════════════════ */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ═══════════════════════════════════════════════════════════════
     2. AURORA CANVAS — lightweight, GPU-based
  ══════════════════════════════════════════════════════════════════ */
  const canvas = document.getElementById("aurora-canvas");
  const ctx = canvas.getContext("2d");

  // Mouse inertia state
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  document.addEventListener(
    "mousemove",
    (e) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
    },
    { passive: true },
  );

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  // Aurora blobs
  const blobs = [
    { x: 0.2, y: 0.3, r: 0.35, h: 220, s: 0.5, l: 0.12, speed: 0.0008 },
    { x: 0.7, y: 0.6, r: 0.4, h: 45, s: 0.6, l: 0.1, speed: 0.0006 },
    { x: 0.5, y: 0.8, r: 0.3, h: 200, s: 0.4, l: 0.08, speed: 0.001 },
    { x: 0.85, y: 0.2, r: 0.25, h: 40, s: 0.5, l: 0.07, speed: 0.0009 },
  ];

  let auroraVisible = false;
  let t = 0;
  let rafId;

  function isInDarkSection() {
    const scroll = window.scrollY + window.innerHeight * 0.5;
    const stats = document.getElementById("stats");
    const footer = document.querySelector("footer");
    if (!stats || !footer) return false;
    return scroll > stats.offsetTop;
  }

  function drawAurora() {
    t += 0.5;
    // Inertia on mouse
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isInDarkSection()) {
      rafId = requestAnimationFrame(drawAurora);
      return;
    }

    blobs.forEach((b) => {
      const ox = Math.sin(t * b.speed * 1000 + b.h) * 0.08;
      const oy = Math.cos(t * b.speed * 800 + b.h) * 0.06;

      // Mouse influence (very subtle)
      const mx = (mouse.x - 0.5) * 0.04;
      const my = (mouse.y - 0.5) * 0.03;

      const cx = (b.x + ox + mx) * canvas.width;
      const cy = (b.y + oy + my) * canvas.height;
      const r = b.r * Math.max(canvas.width, canvas.height);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `hsla(${b.h}, ${b.s * 100}%, ${b.l * 100}%, 0.55)`);
      grad.addColorStop(
        0.5,
        `hsla(${b.h}, ${b.s * 100}%, ${b.l * 50}%,  0.25)`,
      );
      grad.addColorStop(1, `hsla(${b.h}, ${b.s * 100}%, ${b.l * 20}%,  0)`);

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    rafId = requestAnimationFrame(drawAurora);
  }

  // Show canvas only when user scrolls into dark sections
  const auroraObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !auroraVisible) {
          auroraVisible = true;
          canvas.classList.add("visible");
          drawAurora();
        }
      });
    },
    { threshold: 0.1 },
  );

  const statsSection = document.getElementById("stats");
  if (statsSection) auroraObserver.observe(statsSection);

  /* ═══════════════════════════════════════════════════════════════
     3. PARTICLES (Purpurina) — optimized, requestAnimationFrame
  ══════════════════════════════════════════════════════════════════ */
  const particleCanvas = document.createElement("canvas");
  particleCanvas.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0;transition:opacity 1.5s ease;";
  document.body.appendChild(particleCanvas);
  const pc = particleCanvas.getContext("2d");

  function resizeParticle() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }
  resizeParticle();
  window.addEventListener("resize", resizeParticle, { passive: true });

  // Particle pool — kept small for performance
  const PARTICLE_COUNT = 60;
  const particles = [];

  function createParticle(forced = false) {
    return {
      x: Math.random() * particleCanvas.width,
      y: forced
        ? particleCanvas.height + 10
        : Math.random() * particleCanvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.4 + 0.2),
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.6 ? 43 : 200, // Gold or Sapphire
      life: 1,
      decay: Math.random() * 0.003 + 0.001,
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

  let particlesVisible = false;

  function drawParticles() {
    pc.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    if (!isInDarkSection()) {
      requestAnimationFrame(drawParticles);
      return;
    }

    // Mouse influence on particles
    const mxInfluence = (mouse.x - 0.5) * particleCanvas.width;

    particles.forEach((p, i) => {
      p.x += p.vx + mxInfluence * 0.0002;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < -10) {
        particles[i] = createParticle(true);
        return;
      }

      pc.globalAlpha = p.opacity * p.life;
      pc.fillStyle = `hsl(${p.hue}, 70%, 70%)`;
      pc.beginPath();
      pc.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      pc.fill();
    });

    pc.globalAlpha = 1;
    requestAnimationFrame(drawParticles);
  }

  const particleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !particlesVisible) {
          particlesVisible = true;
          particleCanvas.style.opacity = "1";
          drawParticles();
        }
      });
    },
    { threshold: 0.1 },
  );

  if (statsSection) particleObserver.observe(statsSection);

  /* ═══════════════════════════════════════════════════════════════
     4. SCROLL REVEAL — bidirectional
  ══════════════════════════════════════════════════════════════════ */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
        else entry.target.classList.remove("is-visible"); // bidirectional
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ═══════════════════════════════════════════════════════════════
     5. COUNTER ANIMATION — fires ONCE via unobserve
  ══════════════════════════════════════════════════════════════════ */
  const counters = document.querySelectorAll(".counter");

  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const isFloat = String(target).includes(".");
    const duration = 2000; // ms
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const value = target * eased;

      el.textContent = isFloat
        ? value.toFixed(1) + suffix
        : Math.round(value) + suffix;

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target); // ← REGRA DE DISPARO ÚNICO
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => counterObserver.observe(c));

  /* ═══════════════════════════════════════════════════════════════
     6. LOGO FALLBACK
  ══════════════════════════════════════════════════════════════════ */
  document.querySelectorAll("img[onerror]").forEach((img) => {
    img.addEventListener("error", function () {
      this.style.display = "none";
      const fallback = document.getElementById("logo-fallback");
      if (fallback) fallback.style.display = "flex";
    });
  });
})();
