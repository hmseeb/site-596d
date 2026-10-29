/* Hillside General Construction & Electrical Company — site scripts
   Progressive enhancement only: every form works without JavaScript. */
(function () {
  'use strict';

  var ENDPOINT = 'https://vision.leadrai.com/api/forms/00d944904c7818c60c4952d3ed0f7caa';
  var THANKS = 'Thanks, your message was sent. We’ll be in touch shortly — or call (818) 896-5400 if it is urgent.';

  /* ---------- mobile navigation ---------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        close();
      } else {
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        close();
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 980) close();
    });
  }

  /* ---------- helpers ---------- */
  function setPageFields() {
    var fields = document.querySelectorAll('input[name="_page"]');
    for (var i = 0; i < fields.length; i++) {
      fields[i].value = window.location.href;
    }
  }

  function showStatus(form, message, isError) {
    var box = form.querySelector('.form-status');
    if (!box) return;
    box.textContent = message;
    box.classList.add('is-visible');
    box.classList.toggle('is-error', !!isError);
    if (!isError) box.setAttribute('role', 'status');
  }

  /* ---------- plain-submission confirmation (?submitted=1) ---------- */
  function initSubmittedBanner() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('submitted') !== '1') return;

    var boxes = document.querySelectorAll('.form-status');
    if (!boxes.length) return;

    for (var i = 0; i < boxes.length; i++) {
      boxes[i].textContent = THANKS;
      boxes[i].classList.add('is-visible');
      boxes[i].classList.remove('is-error');
    }

    // Bring the first confirmation into view without jumping the whole page hard.
    var first = boxes[0];
    if (first && typeof first.scrollIntoView === 'function') {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      first.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    }
  }

  /* ---------- fetch submission (falls back to a plain POST) ---------- */
  function initForms() {
    var forms = document.querySelectorAll('form[data-leadr]');

    Array.prototype.forEach.call(forms, function (form) {
      form.addEventListener('submit', function (e) {
        if (!window.fetch || !form.reportValidity) return; // let the browser post it
        if (!form.checkValidity()) return;                 // let native validation run

        e.preventDefault();

        var button = form.querySelector('button[type="submit"]');
        var originalLabel = button ? button.textContent : '';
        if (button) {
          button.disabled = true;
          button.textContent = 'Sending…';
        }

        var payload = {};
        var data = new FormData(form);
        data.forEach(function (value, key) {
          if (typeof value === 'string') payload[key] = value;
        });
        payload._page = window.location.href;

        fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            if (!res.ok) throw new Error('Request failed: ' + res.status);
            return res.json().catch(function () { return { ok: true }; });
          })
          .then(function (json) {
            if (json && json.ok === false) throw new Error('Submission rejected');
            form.reset();
            setPageFields();
            showStatus(form, THANKS, false);
            if (button) {
              button.disabled = false;
              button.textContent = originalLabel;
            }
          })
          .catch(function () {
            // Network/JS trouble: fall back to a normal browser POST so the lead is never lost.
            if (button) {
              button.disabled = false;
              button.textContent = originalLabel;
            }
            form.removeAttribute('data-leadr');
            HTMLFormElement.prototype.submit.call(form);
          });
      });
    });
  }

  /* ---------- current year ---------- */
  function initYear() {
    var nodes = document.querySelectorAll('[data-year]');
    var year = String(new Date().getFullYear());
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = year;
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    initNav();
    setPageFields();
    initForms();
    initSubmittedBanner();
    initYear();
  });
})();
