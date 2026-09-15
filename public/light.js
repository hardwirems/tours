/*!
 * light.js — runtime for de-hydrated content pages (see scripts/dehydrate.mjs).
 * These pages ship no app bundle; this ~2KB script provides the only two bits of
 * interactivity they need: the mobile nav menu and the cookie-consent banner.
 * It reads the nav links straight from the server-rendered header, so it stays in
 * sync with SiteHeader without duplicating the list. Hydrated (interactive) pages
 * never load this — they use the React components instead.
 */
(function () {
  'use strict';
  var C = { ink: '#0B4155', coral: '#E0533D', cream: '#FDF3E0', surface: '#ffffff', line: '#E5E7EB' };
  var FONT = "600 17px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";

  function initMenu() {
    var trigger = document.querySelector('[aria-label="Open menu"]');
    var desktopNav = document.querySelector('[data-nav="desktop"]');
    if (!trigger || !desktopNav) return;
    var links = Array.prototype.slice.call(desktopNav.querySelectorAll('a[href]'));
    if (!links.length) return;

    var overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Menu');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;display:none';

    var scrim = document.createElement('div');
    scrim.style.cssText = 'position:absolute;inset:0;background:rgba(8,47,59,0.5)';
    overlay.appendChild(scrim);

    var sheet = document.createElement('div');
    sheet.style.cssText = 'position:absolute;top:0;right:0;bottom:0;width:82%;max-width:320px;background:' +
      C.surface + ';box-shadow:-8px 0 30px rgba(0,0,0,0.15);padding:14px 16px;overflow:auto;' +
      'display:flex;flex-direction:column;gap:2px';
    overlay.appendChild(sheet);

    var close = document.createElement('button');
    close.setAttribute('aria-label', 'Close menu');
    close.type = 'button';
    close.textContent = '✕';
    close.style.cssText = 'align-self:flex-end;font-size:22px;line-height:1;background:none;border:0;color:' +
      C.ink + ';padding:8px;cursor:pointer';
    sheet.appendChild(close);

    links.forEach(function (a) {
      var item = document.createElement('a');
      item.href = a.getAttribute('href');
      item.textContent = (a.textContent || '').trim();
      item.style.cssText = 'display:block;padding:14px 8px;font:' + FONT + ';color:' + C.ink +
        ';text-decoration:none;border-bottom:1px solid ' + C.line;
      sheet.appendChild(item);
    });

    document.body.appendChild(overlay);

    function open() {
      overlay.style.display = 'block';
      document.documentElement.style.overflow = 'hidden';
      trigger.setAttribute('aria-expanded', 'true');
      close.focus();
    }
    function shut() {
      overlay.style.display = 'none';
      document.documentElement.style.overflow = '';
      trigger.setAttribute('aria-expanded', 'false');
      try { trigger.focus(); } catch (e) {}
    }
    trigger.addEventListener('click', function (e) { e.preventDefault(); open(); });
    close.addEventListener('click', shut);
    scrim.addEventListener('click', shut);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.style.display === 'block') shut();
    });
  }

  function initConsent() {
    var KEY = 'cookie_consent';
    var v;
    try { v = localStorage.getItem(KEY); } catch (e) { return; } // storage blocked → stay denied, don't nag
    if (v === 'granted' || v === 'denied') return;

    var bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:9999;background:' + C.ink +
      ';padding:12px 16px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center';

    var txt = document.createElement('p');
    txt.textContent = 'We use cookies for analytics to see how visitors use the site. Cloudflare traffic ' +
      'stats are always on and cookieless; Google Analytics runs only if you accept.';
    txt.style.cssText = 'margin:0;color:' + C.cream +
      ";font:13px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;flex:1 1 200px;max-width:720px";
    bar.appendChild(txt);

    var actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:8px';
    function mk(label, primary) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.cssText = primary
        ? 'padding:8px 18px;border:0;border-radius:8px;background:' + C.coral +
          ";color:#fff;font:700 13px -apple-system,sans-serif;cursor:pointer"
        : 'padding:8px 14px;border:1px solid ' + C.cream + ';border-radius:8px;background:none;color:' + C.cream +
          ";font:600 13px -apple-system,sans-serif;cursor:pointer";
      return b;
    }
    var decline = mk('Decline', false);
    var accept = mk('Accept', true);
    actions.appendChild(decline);
    actions.appendChild(accept);
    bar.appendChild(actions);

    function apply(val) {
      try { localStorage.setItem(KEY, val); } catch (e) {}
      if (typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: val });
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    }
    decline.addEventListener('click', function () { apply('denied'); });
    accept.addEventListener('click', function () { apply('granted'); });
    document.body.appendChild(bar);
  }

  function boot() {
    try { initMenu(); } catch (e) {}
    try { initConsent(); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
