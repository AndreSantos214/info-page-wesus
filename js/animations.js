/**
 * It's Wesus – Motor de Animação Unificado e Otimizado v2.3
 */

document.addEventListener("DOMContentLoaded", () => {
  // ─── 0. DETEÇÃO ULTRA-AVANÇADA DE HARDWARE (MÓVEL/TABLET REFORÇADO) ───
  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0;

  // Captura iPads modernos que se mascaram como "Macintosh" de Desktop e tablets Android
  const isTabletUA =
    (/iPad|Macintosh/i.test(navigator.userAgent) &&
      navigator.maxTouchPoints > 1) ||
    /Tablet|Android/i.test(navigator.userAgent);
  const isMobileUA =
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  const isMobileOrTablet =
    window.innerWidth < 1024 || isTouchDevice || isTabletUA || isMobileUA;

  const heroStage = document.getElementById("hero-stage");
  const videoHero = document.querySelector("#hero-stage video");

  // ─── BANNER DE DEBUG VISUAL (REMOVER ANTES DE IR PARA PRODUÇÃO) ───
  (() => {
    const debugBox = document.createElement("div");
    debugBox.style.position = "fixed";
    debugBox.style.bottom = "20px";
    debugBox.style.right = "20px";
    debugBox.style.zIndex = "999999";
    debugBox.style.backgroundColor = "rgba(4, 17, 36, 0.95)";
    debugBox.style.border = "2px solid #c5a059";
    debugBox.style.borderRadius = "12px";
    debugBox.style.padding = "16px";
    debugBox.style.fontFamily = "monospace";
    debugBox.style.fontSize = "11px";
    debugBox.style.color = "#ffffff";
    debugBox.style.boxShadow = "0 20px 40px rgba(0,0,0,0.8)";
    debugBox.style.pointerEvents = "none"; // Não atrapalha os cliques na página

    debugBox.innerHTML = `
      <b style="color: #c5a059; font-size: 12px;">WESUS HARDWARE ENGINE</b><br>
      <hr style="border-color: rgba(255,255,255,0.1); margin: 8px 0;">
      <b>Largura da Tela:</b> ${window.innerWidth}px<br>
      <b>Dispositivo Touch (pointer: coarse):</b> ${window.matchMedia("(pointer: coarse)").matches}<br>
      <b>maxTouchPoints:</b> ${navigator.maxTouchPoints}<br>
      <hr style="border-color: rgba(255,255,255,0.1); margin: 8px 0;">
      <b>Deteção por UserAgent:</b><br>
      - Is Tablet UA: <span style="color: ${isTabletUA ? "#55ff55" : "#ff5555"}">${isTabletUA}</span><br>
      - Is Mobile UA: <span style="color: ${isMobileUA ? "#55ff55" : "#ff5555"}">${isMobileUA}</span><br>
      <hr style="border-color: rgba(255,255,255,0.1); margin: 8px 0;">
      <b>VEREDITO FINAL:</b><br>
      <span style="font-size: 13px; color: ${isMobileOrTablet ? "#55ff55" : "#ffea55"}">
        <b>isMobileOrTablet = ${isMobileOrTablet}</b>
      </span><br>
      <span style="font-size: 10px; color: #888;">
        (${isMobileOrTablet ? "Modo Estático Ativado" : "Modo Desktop Ativado"})
      </span>
    `;
    document.body.appendChild(debugBox);

    // Mantém o Log clássico no console caso precises ligar o cabo
    console.log("=== WESUS RADAR ===");
    console.log("Largura:", window.innerWidth);
    console.log("Touch:", isTouchDevice, "Points:", navigator.maxTouchPoints);
    console.log("TabletUA:", isTabletUA, "MobileUA:", isMobileUA);
    console.log("Resultado isMobileOrTablet:", isMobileOrTablet);
  })();

  // ─── 1. CONTROLE DINÂMICO DO HEADER (SCROLL REFINED - DESKTOP ONLY) ───
  const header = document.getElementById("mainHeader");
  const headerLogo = document.getElementById("headerLogo");

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
      headerLogo.classList.remove("logo-hidden");
    } else {
      header.classList.remove("scrolled");
      headerLogo.classList.add("logo-hidden");
    }
  }

  // Se for Mobile/Tablet, o header já nasce fixo nativamente no CSS para evitar jank
  if (!isMobileOrTablet) {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  } else {
    header.classList.add("scrolled");
    headerLogo.classList.remove("logo-hidden");
    console.log(
      "Wesus Engine: Header imobilizado estaticamente para ganho de FPS.",
    );
  }

  // ─── 2. LÓGICA DO MENU HAMBÚRGUER MOBILE ───
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  const closeIcon = document.getElementById("closeIcon");

  if (mobileMenuBtn && mobileMenu) {
    const toggleMenu = () => {
      const isMenuHidden = mobileMenu.classList.contains("hidden");
      if (isMenuHidden) {
        mobileMenu.classList.remove("hidden");
        hamburgerIcon.classList.add("hidden");
        closeIcon.classList.remove("hidden");
      } else {
        mobileMenu.classList.add("hidden");
        hamburgerIcon.classList.remove("hidden");
        closeIcon.classList.add("hidden");
      }
    };

    mobileMenuBtn.addEventListener("click", toggleMenu);

    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", toggleMenu);
    });
  }

  // ─── 3. ENGINE DE PARTÍCULAS INTELIGENTE (CONSUMO ZERO FORA DE TELA) ───
  const canvasHero = document.getElementById("wesusGoldDustCanvas");
  const canvasApp = document.getElementById("plataformaGoldDustCanvas");

  if (canvasHero && canvasApp) {
    const ctxHero = canvasHero.getContext("2d");
    const ctxApp = canvasApp.getContext("2d");

    let particlesHero = [];
    let particlesApp = [];

    const particleCount = isMobileOrTablet ? 15 : 120;

    let isHeroSectionVisible = true;
    let isAppSectionVisible = false;

    function resize() {
      const widthHero = canvasHero.offsetWidth;
      const heightHero = canvasHero.offsetHeight;
      const widthApp = canvasApp.offsetWidth;
      const heightApp = canvasApp.offsetHeight;

      canvasHero.width = widthHero;
      canvasHero.height = heightHero;
      canvasApp.width = widthApp;
      canvasApp.height = heightApp;
    }
    window.addEventListener("resize", resize, { passive: true });
    resize();

    const goldColors = [
      "rgba(197, 160, 89,",
      "rgba(232, 208, 141,",
      "rgba(245, 227, 181,",
    ];

    class DustParticle {
      constructor(targetCanvas) {
        this.canvas = targetCanvas;
        this.reset();
        this.y = Math.random() * this.canvas.height;
      }
      reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + Math.random() * 20;
        this.size = Math.random() * 1.4 + 0.4;
        this.speedY = -(Math.random() * 0.25 + 0.05);
        this.speedX = Math.random() * 0.16 - 0.08;
        this.baseColor =
          goldColors[Math.floor(Math.random() * goldColors.length)];
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.35 + 0.15;
        this.fadeSpeed = Math.random() * 0.004 + 0.002;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > this.canvas.height - 100 && this.alpha < this.maxAlpha) {
          this.alpha += this.fadeSpeed;
        } else if (this.y < 150) {
          this.alpha -= this.fadeSpeed;
        } else {
          this.alpha = this.maxAlpha;
        }
        if (
          this.y < 0 ||
          this.alpha <= 0 ||
          this.x < 0 ||
          this.x > this.canvas.width
        ) {
          this.reset();
        }
      }
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.baseColor}${this.alpha})`;
        ctx.fill();
      }
    }

    if (heroStage) {
      new IntersectionObserver(
        (entries) => {
          isHeroSectionVisible = entries[0].isIntersecting;
        },
        { threshold: 0.01 },
      ).observe(heroStage);
    }

    const plataformaSection = document.getElementById("plataforma");
    if (plataformaSection) {
      new IntersectionObserver(
        (entries) => {
          isAppSectionVisible = entries[0].isIntersecting;
        },
        { threshold: 0.01 },
      ).observe(plataformaSection);
    }

    function animate() {
      if (isHeroSectionVisible) {
        ctxHero.clearRect(0, 0, canvasHero.width, canvasHero.height);
        for (let i = 0; i < particlesHero.length; i++) {
          particlesHero[i].update();
          particlesHero[i].draw(ctxHero);
        }
      }
      if (isAppSectionVisible) {
        ctxApp.clearRect(0, 0, canvasApp.width, canvasApp.height);
        for (let i = 0; i < particlesApp.length; i++) {
          particlesApp[i].update();
          particlesApp[i].draw(ctxApp);
        }
      }
      requestAnimationFrame(animate);
    }

    setTimeout(() => {
      for (let i = 0; i < particleCount; i++) {
        particlesHero.push(new DustParticle(canvasHero));
        particlesApp.push(new DustParticle(canvasApp));
      }
      requestAnimationFrame(animate);
      console.log("Wesus Engine: Motor de partículas ativado de forma limpa.");
    }, 1000);
  }

  // ─── 4. INTERSECTION OBSERVER PARA REVELAÇÃO DAS SEÇÕES (DESKTOP SEM TOQUE) ───
  const revealElements = document.querySelectorAll(".apple-reveal");

  if (!isMobileOrTablet) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -20% 0px", threshold: 0.01 },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    // SE FOR MOBILE/TABLET: Ignora o observer e força todos a nascerem ativos no milissegundo zero
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // ─── 5. ENGINE DE REFRAÇÃO DE LUZ CRISTALINA VIA SCROLL (DESKTOP ONLY) ───
  const crystalCards = document.querySelectorAll(".hero-card-crystal");
  let ticking = false;
  const desktopMedia = window.matchMedia("(min-width: 1024px)");

  function updateGlassRefraction() {
    if (!desktopMedia.matches || isTouchDevice || isTabletUA) {
      ticking = false;
      return;
    }

    const viewHeight = window.innerHeight;
    const cardsToUpdate = Array.from(crystalCards).map((card) => {
      const rect = card.getBoundingClientRect();
      return {
        card,
        rect,
        offsetHeight: card.offsetHeight,
        isVisible: rect.top < viewHeight && rect.bottom > 0,
      };
    });

    cardsToUpdate.forEach(({ card, rect, offsetHeight, isVisible }) => {
      if (isVisible) {
        const progress = (viewHeight - rect.top) / (viewHeight + offsetHeight);
        const shineX = progress * 260 - 80;
        card.style.setProperty("--shine-x", `${shineX}%`);
      }
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (isMobileOrTablet) return;

      if (!ticking) {
        requestAnimationFrame(updateGlassRefraction);
        ticking = true;
      }
    },
    { passive: true },
  );

  // ─── 7. ENGINE DE REPRODUÇÃO E FIXAÇÃO DE VIEWPORT ───
  if (heroStage && isMobileOrTablet) {
    const realHeight = window.innerHeight;
    heroStage.style.height = `${realHeight}px`;
    console.log(
      `Wesus Engine: Altura da Hero protegida no tablet/mobile: ${realHeight}px.`,
    );
  }

  if (videoHero) {
    setTimeout(() => {
      videoHero.play().catch((err) => console.log("Aviso de Autoplay:", err));
    }, 300);
  }
});
