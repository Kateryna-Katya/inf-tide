document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  lucide.createIcons();

  // 2. Initialize Lenis Smooth Scroll
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

  // Integrate Lenis with GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Mobile Menu Logic (Simple Toggle)
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');

  // Note: In a real mobile implementation, we would toggle a separate mobile menu container
  // For this stage, we keep it prepared for the next steps.
  if(burger) {
      burger.addEventListener('click', () => {
          // Simple visual feedback for now
          console.log('Menu toggled');
      });
  }
});