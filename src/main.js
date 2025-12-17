document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------
  // 1. Инициализация иконок
  // --------------------------------------------------------
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // --------------------------------------------------------
  // 2. Инициализация Lenis (Smooth Scroll)
  // --------------------------------------------------------
  if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
      });

      function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
  }

  // --------------------------------------------------------
  // 3. GSAP + ScrollTrigger
  // --------------------------------------------------------
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // --- HERO SECTION ---
      const heroTl = gsap.timeline();
      heroTl.from('.hero__title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' })
            .from('.hero__desc', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
            .from('.hero__btns', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
            .from('.hero__image-wrapper', { scale: 0.9, opacity: 0, duration: 1 }, '-=0.8');

      // Параллакс картинки в Hero
      gsap.to('.hero__img', {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true
          }
      });

      // ========================================================
      // ПЕРЕПИСАННАЯ ЛОГИКА АНИМАЦИЙ ЧЕРЕЗ FOR EACH
      // ========================================================

      // --- 1. ABOUT SECTION (forEach) ---
      const aboutCards = document.querySelectorAll('.about__card');
      const aboutContainer = document.querySelector('.about__grid');

      if (aboutCards.length > 0) {
          aboutCards.forEach((card, index) => {
              gsap.from(card, {
                  scrollTrigger: {
                      trigger: aboutContainer, // Триггер срабатывает, когда появляется сетка
                      start: 'top 80%',
                  },
                  y: 50,       // Сдвиг снизу вверх
                  opacity: 0,  // Появление из прозрачности
                  duration: 0.8,
                  delay: index * 0.2, // ВРУЧНУЮ задаем задержку для каждой карточки (0s, 0.2s, 0.4s)
                  ease: 'power2.out',
                  clearProps: 'all' // Очищаем стили после анимации, чтобы избежать багов
              });
          });
      }

      // --- 2. BENEFITS SECTION (forEach) ---
      const benefitItems = document.querySelectorAll('.benefit-item');
      const benefitList = document.querySelector('.benefits__list');

      if (benefitItems.length > 0) {
          benefitItems.forEach((item, index) => {
              gsap.from(item, {
                  scrollTrigger: {
                      trigger: benefitList,
                      start: 'top 85%',
                  },
                  x: -30,      // Сдвиг слева направо
                  opacity: 0,
                  duration: 0.6,
                  delay: index * 0.15, // Ручная задержка
                  ease: 'power2.out',
                  clearProps: 'all'
              });
          });
      }

      // --- 3. BLOG SECTION (forEach) ---
      const blogCards = document.querySelectorAll('.blog-card');
      const blogGrid = document.querySelector('.blog__grid');

      if (blogCards.length > 0) {
          blogCards.forEach((card, index) => {
              gsap.from(card, {
                  scrollTrigger: {
                      trigger: blogGrid,
                      start: 'top 80%',
                  },
                  y: 30,
                  opacity: 0,
                  duration: 0.8,
                  delay: index * 0.2, // Ручная задержка
                  ease: 'power2.out',
                  clearProps: 'all'
              });
          });
      }

      // --- 4. INNOVATION (Счетчики) ---
      const statNumbers = document.querySelectorAll('.stat-num');
      statNumbers.forEach(stat => {
          const targetValue = +stat.getAttribute('data-val');
          let proxy = { value: 0 };

          gsap.to(proxy, {
              value: targetValue,
              duration: 2,
              scrollTrigger: {
                  trigger: '.innovation',
                  start: 'top 80%',
              },
              onUpdate: function() {
                  stat.innerText = Math.ceil(proxy.value);
              },
              ease: 'power1.inOut'
          });
      });

  } else {
      console.error('GSAP library not loaded.');
  }

  // --------------------------------------------------------
  // 4. Мобильное Меню
  // --------------------------------------------------------
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  let isMenuOpen = false;

  if (burger && mobileMenu) {
      burger.addEventListener('click', toggleMenu);
      mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
  }

  function toggleMenu() {
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
          mobileMenu.classList.add('is-open');
          document.body.style.overflow = 'hidden';
          gsap.to(mobileLinks, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2 });
      } else {
          mobileMenu.classList.remove('is-open');
          document.body.style.overflow = '';
          gsap.to(mobileLinks, { y: 20, opacity: 0, duration: 0.3 });
      }
  }

  // --------------------------------------------------------
  // 5. Форма
  // --------------------------------------------------------
  const form = document.getElementById('consultation-form');
  const captchaLabel = document.getElementById('captcha-label');
  const captchaInput = document.getElementById('captcha');

  let num1 = Math.floor(Math.random() * 10);
  let num2 = Math.floor(Math.random() * 10);
  if(captchaLabel) captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;

  if (form) {
      form.addEventListener('submit', function(e) {
          e.preventDefault();
          let isValid = true;
          document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));

          const name = document.getElementById('name');
          if (!name.value.trim()) { setError(name); isValid = false; }

          const email = document.getElementById('email');
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError(email); isValid = false; }

          const phone = document.getElementById('phone');
          if (!/^[0-9+ ]{6,}$/.test(phone.value)) { setError(phone); isValid = false; }

          if (parseInt(captchaInput.value) !== (num1 + num2)) { setError(captchaInput); isValid = false; }

          const policy = document.getElementById('policy');
          if (!policy.checked) { alert('Подтвердите согласие.'); isValid = false; }

          if (isValid) {
              const btn = form.querySelector('button');
              const btnText = btn.textContent;
              btn.textContent = 'Отправка...';
              btn.disabled = true;

              setTimeout(() => {
                  form.reset();
                  btn.style.display = 'none';
                  const successMsg = document.querySelector('.form-success');
                  if(successMsg) successMsg.style.display = 'block';
                  num1 = Math.floor(Math.random() * 10);
                  num2 = Math.floor(Math.random() * 10);
                  if(captchaLabel) captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;
                  setTimeout(() => { btn.disabled = false; btn.textContent = btnText; }, 5000);
              }, 1500);
          }
      });
  }

  function setError(input) {
      if(input && input.parentElement) input.parentElement.classList.add('error');
  }
});