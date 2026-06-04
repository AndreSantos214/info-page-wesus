/**
 * It's Wesus – Motor de Animação Unificado e Otimizado v2
 */

document.addEventListener("DOMContentLoaded", () => {
  // ─── 1. CONTROLE DINÂMICO DO HEADER (SCROLL REFINED) ───
  const header = document.getElementById("mainHeader");
  const headerLogo = document.getElementById("headerLogo");

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
      headerLogo.classList.remove("logo-hidden"); // Remove o estado oculto
    } else {
      header.classList.remove("scrolled");
      headerLogo.classList.add("logo-hidden"); // Injeta o estado oculto
    }
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

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

    const isMobile = window.innerWidth < 1024;
    const particleCount = isMobile ? 15 : 120;

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

    // Gerenciador de ciclo de vida das seções
    const heroSection = document.getElementById("hero-stage");
    if (heroSection) {
      new IntersectionObserver(
        (entries) => {
          isHeroSectionVisible = entries[0].isIntersecting;
        },
        { threshold: 0.01 },
      ).observe(heroSection);
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

    // IGNIÇÃO ÚNICA ADIADA: Instancia a quantidade correta apenas uma vez
    setTimeout(() => {
      for (let i = 0; i < particleCount; i++) {
        particlesHero.push(new DustParticle(canvasHero));
        particlesApp.push(new DustParticle(canvasApp));
      }
      requestAnimationFrame(animate);
      console.log("Wesus Engine: Motor de partículas ativado sem duplicações.");
    }, 1000);
  }

  // ─── 4. INTERSECTION OBSERVER PARA REVELAÇÃO DAS SEÇÕES (DESKTOP ONLY) ───
  const revealElements = document.querySelectorAll(".apple-reveal");

  // Condição estática de segurança: Só cria o Observer se for ecrã grande (Desktop)
  if (window.matchMedia("(min-width: 1024px)").matches) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -4% 0px", threshold: 0.01 },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  // ─── 5. ENGINE DE REFRAÇÃO DE LUZ CRISTALINA VIA SCROLL (DESKTOP ONLY) ───
  const crystalCards = document.querySelectorAll(".hero-card-crystal");
  let ticking = false;
  const desktopMedia = window.matchMedia("(min-width: 1024px)");

  function updateGlassRefraction() {
    if (!desktopMedia.matches) {
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
      // CURTO-CIRCUITO IMEDIATO: Impede agendamento de RAF no Mobile/Tablet
      if (window.innerWidth < 1024) return;

      if (!ticking) {
        requestAnimationFrame(updateGlassRefraction);
        ticking = true;
      }
    },
    { passive: true },
  );

  // ─── 7. ENGINE DE REPRODUÇÃO E FIXAÇÃO DE VIEWPORT (TRAVAMENTO ANTI-JANK) ───
  const heroStage = document.getElementById("hero-stage");
  const videoHero = document.querySelector("#hero-stage video");

  // Trava a altura imediatamente com base no cálculo real inicial da janela
  if (heroStage && window.innerWidth < 1024) {
    const realHeight = window.innerHeight;
    heroStage.style.height = `${realHeight}px`;
    console.log(
      `Wesus Engine: Altura da Hero fixada estaticamente em ${realHeight}px.`,
    );
  }

  if (videoHero) {
    setTimeout(() => {
      videoHero.play().catch((err) => console.log("Aviso de Autoplay:", err));
    }, 300);
  }
});
