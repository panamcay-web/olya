/* Полезные завтраки — интерактив мобильного лендинга */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── появление блоков при скролле ───────── */
  var revealables = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
        var nums = e.target.querySelectorAll('.num');
        for (var i = 0; i < nums.length; i++) countUp(nums[i]);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.num').forEach(function (n) { n.textContent = n.dataset.to; });
  }

  /* ── счётчики в блоке пользы ────────────── */
  function countUp(el) {
    var to = parseInt(el.dataset.to, 10);
    var dur = 900;
    var start = performance.now();

    (function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  /* ── раскрытие рецептов ─────────────────── */
  document.querySelectorAll('.toggle').forEach(function (btn) {
    var drop = btn.nextElementSibling;

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';

      if (open) {
        drop.style.maxHeight = '0px';
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('span').textContent = 'Как приготовить';
      } else {
        drop.style.maxHeight = drop.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('span').textContent = 'Свернуть';
      }
    });
  });

  window.addEventListener('resize', function () {
    document.querySelectorAll('.toggle[aria-expanded="true"]').forEach(function (btn) {
      btn.nextElementSibling.style.maxHeight = btn.nextElementSibling.scrollHeight + 'px';
    });
  });

  /* ── липкая кнопка: после первого экрана,  */
  /*    прячется над финальным блоком ─────── */
  var sticky = document.querySelector('.sticky');
  var hero = document.querySelector('.hero');
  var cta = document.querySelector('#cta');
  var heroPassed = false;
  var ctaVisible = false;

  function syncSticky() {
    var show = heroPassed && !ctaVisible;
    sticky.classList.toggle('show', show);
    sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
    sticky.tabIndex = show ? 0 : -1;
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      heroPassed = !e[0].isIntersecting;
      syncSticky();
    }, { threshold: 0.35 }).observe(hero);

    new IntersectionObserver(function (e) {
      ctaVisible = e[0].isIntersecting;
      syncSticky();
    }, { threshold: 0.12 }).observe(cta);
  }

  /* ── лёгкий параллакс фото в шапке ──────── */
  var heroImg = document.querySelector('.hero__media img');
  if (heroImg && !reduced) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, window.innerHeight);
        heroImg.style.transform = 'translate3d(0,' + (y * 0.16) + 'px,0) scale(1.06)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── плавная прокрутка по якорям ────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ── заглушка для главной кнопки ────────── */
  var mainCta = document.querySelector('[data-cta]');
  if (mainCta) {
    mainCta.addEventListener('click', function (ev) {
      if (mainCta.getAttribute('href') !== '#') return;
      ev.preventDefault();
      mainCta.textContent = 'Ссылку сюда 🙂';
      setTimeout(function () { mainCta.textContent = 'Получить меню бесплатно'; }, 1800);
    });
  }
})();
