// tiny-fixes.js
// Idempotent, non-visual accessibility and behavior fixes
(function () {
  'use strict';
  function ensureAttr(el, name, value) { if (!el) return; if (!el.hasAttribute(name)) el.setAttribute(name, value); }
  function isVisible(el) { if (!el) return false; return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }

  document.querySelectorAll('[aria-controls]').forEach(btn => {
    const tag = btn.tagName && btn.tagName.toLowerCase();
    if (tag === 'button' || btn.getAttribute('role') === 'button' || btn.classList.contains('btn-outline') || btn.classList.contains('card-trigger')) {
      ensureAttr(btn, 'type', 'button');
      ensureAttr(btn, 'aria-expanded', 'false');
    }
  });

  const honeypotCandidates = [
    document.getElementById('hp_inline'),
    document.getElementById('hp_page'),
    document.getElementById('hp_contact'),
    document.querySelector('input[name="hp_field"]')
  ].filter(Boolean);

  honeypotCandidates.forEach((hp, i) => {
    try {
      if (hp.name === 'hp_field') hp.name = 'hp_' + (hp.id || ('auto' + i));
      hp.setAttribute('hidden', '');
      hp.setAttribute('aria-hidden', 'true');
      hp.setAttribute('tabindex', '-1');
      hp.classList.add('honeypot');
    } catch (e) {}
  });

  document.querySelectorAll('.success-message, #inline-success, #success').forEach(el => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  });

  document.querySelectorAll('form button').forEach(btn => {
    if (!btn.hasAttribute('type')) btn.setAttribute('type', 'button');
  });

  document.querySelectorAll('[aria-controls]').forEach(trigger => {
    const targetId = trigger.getAttribute('aria-controls');
    if (!targetId) return;
    const backdrop = document.getElementById(targetId);
    if (!backdrop) return;
    if (!backdrop.hasAttribute('aria-hidden')) backdrop.setAttribute('aria-hidden', 'true');

    function getFocusables(container) {
      if (!container) return [];
      const selectors = 'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
      return Array.from(container.querySelectorAll(selectors)).filter(el => el.offsetParent !== null || el.getClientRects().length);
    }

    function open() {
      trigger.setAttribute('aria-expanded', 'true');
      backdrop.style.display = 'flex';
      backdrop.setAttribute('aria-hidden', 'false');
      backdrop._opener = trigger;
      const focusables = getFocusables(backdrop);
      if (focusables.length) focusables[0].focus();
      else {
        const modal = backdrop.querySelector('[role="dialog"], .types-modal, .modal');
        if (modal) modal.setAttribute('tabindex', '-1'), modal.focus();
      }
      backdrop._focusables = getFocusables(backdrop);
    }

    function close() {
      trigger.setAttribute('aria-expanded', 'false');
      backdrop.style.display = 'none';
      backdrop.setAttribute('aria-hidden', 'true');
      try { backdrop._opener && backdrop._opener.focus(); } catch (e) {}
      backdrop._focusables = null;
    }

    trigger.addEventListener('click', function () {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      if (expanded) close(); else open();
    });

    backdrop.addEventListener('click', function (ev) {
      if (ev.target === backdrop) close();
    });

    backdrop.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' || ev.key === 'Esc') { ev.preventDefault(); close(); return; }
      if (ev.key !== 'Tab') return;
      const focusables = backdrop._focusables || getFocusables(backdrop);
      if (!focusables.length) { ev.preventDefault(); return; }
      const first = focusables[0], last = focusables[focusables.length - 1], active = document.activeElement;
      if (ev.shiftKey) { if (active === first || active === backdrop) { ev.preventDefault(); last.focus(); } }
      else { if (active === last) { ev.preventDefault(); first.focus(); } }
    });

    backdrop.querySelectorAll('[data-close], .btn-outline[aria-label^="Close"]').forEach(btn => {
      btn.addEventListener('clgrep -n "tiny-fixes.js" index.html || echo "script tag not found"

  });

  window.addEventListener('load', function () {
    document.querySelectorAll('.types-backdrop, .brand-backdrop, .managed-backdrop, .hardware-backdrop, .modal-backdrop').forEach(backdrop => {
      if (backdrop.style.display === 'flex' || backdrop.getAttribute('aria-hidden') === 'false') {
        const focusables = Array.from(backdrop.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
        backdrop._focusables = focusables;
        if (focusables.length) focusables[0].focus();
      }
    });
  });

})();
