(() => {
  const slides = [
    {
      image: 'images/slide-screenings.jpg',
      eyebrow: 'We provide',
      title: 'FREE COMMUNITY HEALTH SCREENINGS',
    },
    {
      image: 'images/slide-community.jpg',
      eyebrow: 'We are',
      title: 'A FAMILY WITH THE COMMUNITY',
    },
    {
      image: 'images/slide-volunteers.jpg',
      eyebrow: 'We gather',
      title: 'PASSIONATE STUDENT VOLUNTEERS',
    },
  ];

  const mount = () => {
    const carousel = document.querySelector('#comp-j9vivvf8');
    if (!carousel || carousel.dataset.staticCarousel === 'ready') return;

    carousel.dataset.staticCarousel = 'ready';
    carousel.innerHTML = `
      <style>
        #comp-j9vivvf8.static-carousel { position: relative; overflow: hidden; height: 650px; width: 100%; color: #fff; }
        #comp-j9vivvf8 .static-carousel__slide { position: absolute; inset: 0; opacity: 0; transition: opacity 700ms ease; background: center / cover no-repeat; }
        #comp-j9vivvf8 .static-carousel__slide::after { content: ''; position: absolute; inset: 0; background: rgba(0, 0, 0, .36); }
        #comp-j9vivvf8 .static-carousel__slide.is-active { opacity: 1; }
        #comp-j9vivvf8 .static-carousel__copy { position: absolute; z-index: 1; top: 72px; left: 50%; width: min(860px, calc(100% - 190px)); transform: translateX(-50%); text-align: center; text-shadow: 0 5px 0 rgba(0,0,0,.3); }
        #comp-j9vivvf8 .static-carousel__eyebrow { margin: 0 0 24px; font-family: didot-w01-italic, Georgia, serif; font-size: 26px; font-style: italic; letter-spacing: .05em; }
        #comp-j9vivvf8 .static-carousel__title { margin: 0; font-family: raleway, Arial, sans-serif; font-weight: 400; font-size: clamp(36px, 4.4vw, 60px); line-height: 1.08; letter-spacing: .06em; }
        #comp-j9vivvf8 .static-carousel__control { position: absolute; z-index: 2; top: 50%; width: 25px; height: 50px; padding: 0; border: 0; color: #fff; background: transparent; cursor: pointer; transform: translateY(-50%); }
        #comp-j9vivvf8 .static-carousel__control::before { content: ''; display: block; width: 27px; height: 27px; border-top: 2px solid currentColor; border-right: 2px solid currentColor; }
        #comp-j9vivvf8 .static-carousel__prev { left: 100px; transform: translateY(-50%) rotate(-135deg); }
        #comp-j9vivvf8 .static-carousel__next { right: 100px; transform: translateY(-50%) rotate(45deg); }
        #comp-j9vivvf8 .static-carousel__dots { position: absolute; z-index: 2; bottom: 45px; left: 50%; display: flex; gap: 12px; transform: translateX(-50%); }
        #comp-j9vivvf8 .static-carousel__dot { width: 8px; height: 8px; padding: 0; border: 1px solid #fff; border-radius: 50%; background: transparent; cursor: pointer; }
        #comp-j9vivvf8 .static-carousel__dot.is-active { background: #fff; }
        @media (max-width: 700px) { #comp-j9vivvf8.static-carousel { height: 500px; } #comp-j9vivvf8 .static-carousel__copy { top: 78px; width: calc(100% - 70px); } #comp-j9vivvf8 .static-carousel__prev { left: 25px; } #comp-j9vivvf8 .static-carousel__next { right: 25px; } }
      </style>
      <div class="static-carousel__slides"></div>
      <button class="static-carousel__control static-carousel__prev" type="button" aria-label="Previous slide"></button>
      <button class="static-carousel__control static-carousel__next" type="button" aria-label="Next slide"></button>
      <div class="static-carousel__dots" aria-label="Choose slide"></div>`;
    carousel.classList.add('static-carousel');

    const slideContainer = carousel.querySelector('.static-carousel__slides');
    const dots = carousel.querySelector('.static-carousel__dots');
    slides.forEach((slide, index) => {
      const element = document.createElement('section');
      element.className = 'static-carousel__slide';
      element.style.backgroundImage = `url("${slide.image}")`;
      element.innerHTML = `<div class="static-carousel__copy"><p class="static-carousel__eyebrow">${slide.eyebrow}</p><h1 class="static-carousel__title">${slide.title}</h1></div>`;
      slideContainer.append(element);
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'static-carousel__dot';
      dot.setAttribute('aria-label', `Show slide ${index + 1}`);
      dot.addEventListener('click', () => show(index));
      dots.append(dot);
    });

    let index = 0;
    let timer;
    const show = (next) => {
      index = (next + slides.length) % slides.length;
      carousel.querySelectorAll('.static-carousel__slide').forEach((slide, position) => slide.classList.toggle('is-active', position === index));
      carousel.querySelectorAll('.static-carousel__dot').forEach((dot, position) => dot.classList.toggle('is-active', position === index));
    };
    const restart = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => show(index + 1), 6500);
    };
    carousel.querySelector('.static-carousel__prev').addEventListener('click', () => { show(index - 1); restart(); });
    carousel.querySelector('.static-carousel__next').addEventListener('click', () => { show(index + 1); restart(); });
    show(0);
    restart();
  };

  window.addEventListener('load', () => window.setTimeout(mount, 500), { once: true });
})();
