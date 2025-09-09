/* global ScrollTrigger */
(function () {
  "use strict";
  console.log("🚀 main.js carregado");

  let swiperInstance = null; // Variável para guardar a instância do Swiper

  // Função para inicializar o Swiper
  function initSwiper() {
    if (window.Swiper && !swiperInstance) {
      swiperInstance = new Swiper(".portfolio-swiper", {
        loop: false,
        slidesPerView: "auto",
        spaceBetween: 24,
        speed: 500,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          bulletClass: "dots-item",
          bulletActiveClass: "active",
          renderBullet: (idx, className) =>
            `<li class="${className}"><button type="button" aria-label="Página ${
              idx + 1
            }">${idx + 1}</button></li>`,
        },
      });
      console.log("Swiper inicializado (desktop)");
    } else {
      console.warn("⚠️ Swiper não encontrado – pulei slider");
    }
  }

  // Função para destruir o Swiper
  function destroySwiper() {
    if (swiperInstance) {
      swiperInstance.destroy();
      swiperInstance = null;
      console.log("Swiper destruído");
    }
  }

  // Função para verificar a largura da tela e inicializar/destruir o Swiper
  function checkScreenWidth() {
    if (window.matchMedia("(min-width: 768px)").matches) {
      // Se a tela for maior que 768px, inicializa o Swiper
      initSwiper();
    } else {
      // Se a tela for menor que 768px, destrói o Swiper
      destroySwiper();
    }
  }

  // Inicializa o Swiper na primeira carga da página
  checkScreenWidth();

  // Adiciona um listener para o evento resize
  window.addEventListener("resize", checkScreenWidth);

    //
  // ——— 4) GSAP ScrollTrigger para cards ———
  //
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray(".card");
    if (cards.length) {
      cards[0].classList.add("card_active");
      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top center",
          onEnter: () => card.classList.add("card_active"),
        });
        ScrollTrigger.create({
          trigger: card,
          start: "bottom center",
          onLeaveBack: () => card.classList.remove("card_active"),
        });
      });
    }
  } else {
    console.warn("⚠️ GSAP/ScrollTrigger não encontrado – pulei animações");
  }
})();
