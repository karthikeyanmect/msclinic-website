/* MS Clinic — msclinic.in */
(function () {
  'use strict';

  /* ----- Sticky header shadow ----- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- Mobile nav ----- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobileNav.classList.toggle('is-open', !open);
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
      }
    });
  }

  /* ----- Accessible tabs ----- */
  document.querySelectorAll('[data-tabs]').forEach(function (widget) {
    var tabs = Array.prototype.slice.call(widget.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(widget.querySelectorAll('[role="tabpanel"]'));

    function activate(tab, focus) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.classList.toggle('is-active', selected);
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(function (p) {
        var show = p.id === tab.getAttribute('aria-controls');
        p.classList.toggle('is-active', show);
        p.hidden = !show;
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); activate(next, true); }
      });
    });
  });

  /* ----- Scroll-spy for nav ----- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ----- Reveal on scroll (single elements + staggered groups) ----- */
  var reveals = document.querySelectorAll('.reveal, .reveal-group');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ----- Live open/closed status (Mon-Sat, 4:00 PM - 9:00 PM IST) ----- */
  var statusChip = document.getElementById('open-status');
  var statusText = document.getElementById('open-status-text');
  if (statusChip && statusText) {
    try {
      var nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      var day = nowIST.getDay(); /* 0 = Sunday */
      var mins = nowIST.getHours() * 60 + nowIST.getMinutes();
      var open = day !== 0 && mins >= 16 * 60 && mins < 21 * 60;
      statusChip.classList.add(open ? 'is-open' : 'is-closed');
      if (open) {
        statusText.textContent = 'Open now · till 9 PM';
      } else if (day === 0) {
        statusText.textContent = 'Closed today · opens Mon 4 PM';
      } else if (mins < 16 * 60) {
        statusText.textContent = 'Opens today at 4 PM';
      } else if (day === 6) {
        statusText.textContent = 'Closed · opens Monday 4 PM';
      } else {
        statusText.textContent = 'Closed · opens tomorrow 4 PM';
      }
      statusChip.hidden = false;
    } catch (e) { /* leave chip hidden if timezone lookup fails */ }
  }

  /* ----- FAQ: close others when one opens ----- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq details'));
  faqItems.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) {
        faqItems.forEach(function (other) { if (other !== d) other.open = false; });
      }
    });
  });

  /* ----- Footer year ----- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
