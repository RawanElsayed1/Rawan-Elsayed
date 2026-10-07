/**
 * RAWAN EL SAYED MOHAMED — PORTFOLIO JAVASCRIPT
 * Vanilla JavaScript implementation for interactions, animations, theme toggling,
 * mobile drawer navigation, neural network canvas, and accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. THEME TOGGLE (DARK / LIGHT MODE WITH LOCALSTORAGE)
     ------------------------------------------------------------------------ */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or fallback to dark theme (as specified in requirements)
  const savedTheme = localStorage.getItem('rawan-portfolio-theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('rawan-portfolio-theme', newTheme);
      
      // Update canvas colors on theme change
      if (typeof updateCanvasColors === 'function') {
        updateCanvasColors();
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER & ACCESSIBILITY
     ------------------------------------------------------------------------ */
  const hamburgerBtn = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    const toggleMenu = () => {
      const isOpen = navMenu.classList.contains('open');
      navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', !isOpen);
    };

    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && 
          !navMenu.contains(e.target) && 
          !hamburgerBtn.contains(e.target)) {
        toggleMenu();
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. STICKY NAVBAR SHADOW & SCROLL MONITORING
     ------------------------------------------------------------------------ */
  const header = document.getElementById('navbar');
  const floatingBackToTop = document.getElementById('floating-back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header shadow on scroll
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Floating back to top button visibility
    if (floatingBackToTop) {
      if (scrollY > 350) {
        floatingBackToTop.classList.add('visible');
      } else {
        floatingBackToTop.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  /* ------------------------------------------------------------------------
     4. BACK TO TOP BUTTONS
     ------------------------------------------------------------------------ */
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (floatingBackToTop) {
    floatingBackToTop.addEventListener('click', scrollToTop);
  }

  const footerBackToTop = document.getElementById('footer-back-to-top');
  if (footerBackToTop) {
    footerBackToTop.addEventListener('click', scrollToTop);
  }

  /* ------------------------------------------------------------------------
     5. ACTIVE NAVIGATION LINK ON SCROLL (INTERSECTION OBSERVER)
     ------------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');

  const navObserverOptions = {
    root: null,
    rootMargin: '-25% 0px -65% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  /* ------------------------------------------------------------------------
     6. REVEAL ANIMATIONS ON SCROLL
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------------
     7. CONTACT FORM VALIDATION & INTERACTIVE HANDLING
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const inputs = [
        { field: nameInput, condition: nameInput.value.trim().length > 0 },
        { field: emailInput, condition: validateEmail(emailInput.value.trim()) },
        { field: subjectInput, condition: subjectInput.value.trim().length > 0 },
        { field: messageInput, condition: messageInput.value.trim().length > 0 }
      ];

      inputs.forEach(({ field, condition }) => {
        const group = field.closest('.form-group');
        if (!condition) {
          group.classList.add('has-error');
          isValid = false;
        } else {
          group.classList.remove('has-error');
        }
      });

      if (isValid) {
        // Show success confirmation notice
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = `Thank you, ${nameInput.value.trim()}! Your message has been prepared. (Note: In this client demonstration, no external mail server is attached.)`;
        formFeedback.style.display = 'block';

        contactForm.reset();

        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 7000);
      } else {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill out all required fields with valid details.';
        formFeedback.style.display = 'block';
      }
    });

    // Clear error on input typing
    const formFields = contactForm.querySelectorAll('.form-input, .form-textarea');
    formFields.forEach(field => {
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. INTERACTIVE NEURAL NETWORK CANVAS BACKGROUND
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('neural-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;

    // Node & line styling configuration
    let particleColor = 'rgba(0, 210, 255, 0.45)';
    let lineColor = 'rgba(0, 210, 255, 0.08)';

    window.updateCanvasColors = () => {
      const isDark = htmlElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        particleColor = 'rgba(0, 210, 255, 0.45)';
        lineColor = 'rgba(0, 210, 255, 0.09)';
      } else {
        particleColor = 'rgba(2, 132, 199, 0.35)';
        lineColor = 'rgba(2, 132, 199, 0.06)';
      }
    };
    updateCanvasColors();

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.8 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce from boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      // Calculate responsive particle density
      const count = Math.min(Math.floor((width * height) / 18000), 55);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      const maxDistance = 140;
      const count = particles.length;

      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1 - dist / maxDistance;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawConnections();

      animationFrameId = requestAnimationFrame(animate);
    };

    // Pause canvas when tab is invisible to conserve CPU/Battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
  }

  /* ------------------------------------------------------------------------
     9. IMAGE MODAL / LIGHTBOX FOR PROJECTS & CERTIFICATES
     ------------------------------------------------------------------------ */
  const imageModal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const modalCaption = document.getElementById('modal-caption');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  window.openImageModal = (src, caption) => {
    if (!imageModal || !modalImg) return;
    
    // Test if image actually loads before displaying modal
    const tempImg = new Image();
    tempImg.onload = () => {
      modalImg.src = src;
      modalImg.alt = caption || 'Preview';
      if (modalCaption) {
        modalCaption.textContent = caption || '';
      }
      imageModal.classList.add('open');
      imageModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    tempImg.onerror = () => {
      // If the file doesn't exist on disk yet, notify gracefully
      console.log(`Image not found at path: ${src}. Place the file to view enlarged.`);
    };
    tempImg.src = src;
  };

  const closeImageModal = () => {
    if (!imageModal) return;
    imageModal.classList.remove('open');
    imageModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalImg) {
      modalImg.src = '';
    }
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeImageModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeImageModal);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageModal && imageModal.classList.contains('open')) {
      closeImageModal();
    }
  });

  /* ------------------------------------------------------------------------
     10. ASSET FALLBACK SAFETY CHECK
     ------------------------------------------------------------------------ */
  // Ensure that any image with missing source gracefully triggers error fallback
  const allDynamicImgs = document.querySelectorAll('.profile-img, .project-banner-img, .cert-img');
  allDynamicImgs.forEach(img => {
    const placeholder = img.parentElement ? img.parentElement.querySelector('.profile-photo-placeholder, .project-banner-placeholder, .cert-placeholder') : null;
    if (img.complete) {
      if (img.naturalWidth === 0) {
        img.classList.add('is-hidden');
        if (placeholder) placeholder.classList.remove('is-hidden');
      } else {
        img.classList.remove('is-hidden');
        if (placeholder) placeholder.classList.add('is-hidden');
      }
    }
  });
});

