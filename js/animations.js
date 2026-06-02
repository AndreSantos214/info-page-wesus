/**
 * It's Wesus – Motor de Animação Cinematográfica V1
 * Foco: Performance Estática, Renderização 60FPS nativa por hardware.
 */

document.addEventListener("DOMContentLoaded", () => {
  
  // ─── 1. REVEAL DE SEÇÕES EM VIEWPORT (Estilo Apple Stage) ───
  const stages = document.querySelectorAll(".apple-stage");
  
  const stageObserverOptions = {
    root: null, // Viewport padrão
    threshold: 0.15, // Ativa quando 15% da seção estiver visível
    rootMargin: "0px 0px -50px 0px"
  };

  const stageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        // Opcional: para animar apenas uma vez, descomente a linha abaixo
        // observer.unobserve(entry.target);
      } else {
        entry.target.classList.remove("revealed");
      }
    });
  }, stageObserverOptions);

  stages.forEach(stage => stageObserver.observe(stage));


  // ─── 2. INTERPOLAÇÃO DE SCROLL (Efeito Parallax Amanteigado) ───
  let currentScroll = 0;
  let targetScroll = 0;
  const ease = 0.08; // Quanto menor o valor, mais "amanteigado" é o deslize

  const heroVideoWrap = document.getElementById("heroVideoContainer");
  const interactiveCard = document.getElementById("interactiveCard");

  function smoothScrollAnimation() {
    // Cálculo do LERP (Linear Interpolation)
    currentScroll += (targetScroll - currentScroll) * ease;

    // Apenas aplica transformações se houver movimentação significativa para poupar GPU
    if (Math.abs(targetScroll - currentScroll) > 0.05) {
      
      // Efeito 1: Zoom out sutil no background do Hero baseado no scroll
      if (heroVideoWrap && currentScroll < window.innerHeight) {
        const zoomFactor = 1.1 - (currentScroll / window.innerHeight) * 0.1;
        heroVideoWrap.style.transform = `scale(${Math.max(1, zoomFactor)}) translate3d(0, ${currentScroll * 0.15}px, 0)`;
      }

      // Efeito 2: Parallax reverso no Card de Vidro da Seção Quem Somos
      if (interactiveCard) {
        const cardRect = interactiveCard.getBoundingClientRect();
        if (cardRect.top < window.innerHeight && cardRect.bottom > 0) {
          const cardOffset = (window.innerHeight / 2 - cardRect.top) * 0.08;
          interactiveCard.style.transform = `translate3d(0, ${cardOffset}px, 0) rotateX(${-cardOffset * 0.1}deg)`;
        }
      }
    }

    requestAnimationFrame(smoothScrollAnimation);
  }

  // Escuta o scroll da janela de forma passiva (essencial para performance mobile)
  window.addEventListener("scroll", () => {
    targetScroll = window.scrollY;
  }, { passive: true });

  // Inicializa o loop de animação contínuo
  requestAnimationFrame(smoothScrollAnimation);


  // ─── 3. EFEITO INTERATIVO MOUSEMOVE (Desktop Dark Luxury) ───
  // Adiciona um reflexo de luz dourada dinâmico ao card quando o mouse passa por cima
  if (interactiveCard && window.innerWidth >= 1024) {
    interactiveCard.addEventListener("mousemove", (e) => {
      const rect = interactiveCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Injeta variáveis de posição direto no CSS para o gradiente de reflexo
      interactiveCard.style.setProperty("--mx", `${x}px`);
      interactiveCard.style.setProperty("--my", `${y}px`);
      
      // Leve rotação 3D baseada na posição do cursor
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const rotateX = (yc - y) / 15;
      const rotateY = (x - xc) / 15;
      
      interactiveCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    interactiveCard.addEventListener("mouseleave", () => {
      interactiveCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  }
});