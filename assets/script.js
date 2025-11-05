// Basic interactive behaviors: nav toggle, reveal on scroll, typed headline, active nav highlight, year update

document.addEventListener('DOMContentLoaded', function () {
  // Year in footer
  const y = new Date().getFullYear();
  ['year','year2','year3','year4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = y;
  });

  // Nav toggle (mobile)
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('open');
      // simple aria
      const expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  // Close mobile nav when link clicked
  document.querySelectorAll('.nav .nav-link').forEach(a => {
    a.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.classList.remove('open');
      }
    });
  });

  // Intersection Observer for reveal animations
  const revealEls = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        o.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  revealEls.forEach(el => obs.observe(el));

  // Active nav highlighting based on pathname
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    try {
      const href = a.getAttribute('href');
      if (href && href === path) {
        a.classList.add('active');
      }
    } catch (e) { /* ignore */ }
  });

  // Small typed effect for hero (fallback if not present)
  (function typedEffect() {
    const typedEl = document.getElementById('typed');
    if (!typedEl) return;
    const words = ['I build interfaces.', 'I make websites feel alive.'];
    let w = 0, i = 0, forward = true;
    function tick(){
      const current = words[w];
      if (forward) {
        i++;
        typedEl.textContent = current.slice(0, i);
        if (i >= current.length) { forward = false; setTimeout(tick, 1500); return; }
      } else {
        i--;
        typedEl.textContent = current.slice(0, i);
        if (i <= 0) { forward = true; w = (w+1) % words.length; setTimeout(tick, 200); return; }
      }
      setTimeout(tick, forward ? 60 : 36);
    }
    tick();
  })();

  // Smooth scroll behavior for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({behavior:'smooth'});
      }
    });
  });

  // Optional: simple keyboard accessibility for nav toggle
  if (toggle) {
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  }
});
