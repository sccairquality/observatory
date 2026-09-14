(function () {
  'use strict';

  var STORAGE_KEY = 'aq26_cookie_choice';
  var banner = document.getElementById('cookie-banner');
  var gaId = document.documentElement.getAttribute('data-ga-id') || window.AQ26_GA_MEASUREMENT_ID || '';

  function installCompanyDisclosure() {
    var footer = document.querySelector('footer');
    if (!footer || footer.querySelector('[data-scc-legal]')) return;
    var legal = document.createElement('div');
    legal.setAttribute('data-scc-legal', '');
    legal.style.cssText = 'max-width:1180px;margin:0 auto;padding:12px 20px 18px;font-size:.78rem;line-height:1.55;opacity:.82';
    legal.innerHTML = 'This Air Quality Project is operated and published by <a href="https://sccnexus.co.uk/">SCC Nexus Limited</a> · Registered in England and Wales · Company No. <a href="https://find-and-update.company-information.service.gov.uk/company/17458303" rel="noopener">17458303</a> · Registered office: 49 Station Road, Polegate, East Sussex, BN26 6EA. Scientific interpretation remains governed by the project methodology, provenance, limitations and publication controls.';
    footer.appendChild(legal);
  }

  function hideBanner() {
    if (banner) {
      banner.classList.remove('show');
      banner.setAttribute('hidden', 'hidden');
      banner.style.display = '';
    }
  }

  function showBanner() {
    if (banner) {
      banner.removeAttribute('hidden');
      banner.style.display = '';
      banner.classList.add('show');
    }
  }

  function ensureGtag() {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function gtag(){ window.dataLayer.push(arguments); };
    }
  }

  function grantAnalytics() {
    if (!gaId) return;
    ensureGtag();
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });
    window.gtag('config', gaId, { 'anonymize_ip': true });
  }

  function denyAnalytics() {
    ensureGtag();
    window.gtag('consent', 'update', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });
  }

  function setChoice(choice) {
    try { localStorage.setItem(STORAGE_KEY, choice); } catch (e) {}
    if (choice === 'accept') grantAnalytics();
    if (choice === 'essential') denyAnalytics();
    hideBanner();
  }

  installCompanyDisclosure();

  var existing = null;
  try { existing = localStorage.getItem(STORAGE_KEY); } catch (e) {}

  if (existing === 'accept') {
    grantAnalytics();
    hideBanner();
    return;
  }

  if (existing === 'essential') {
    denyAnalytics();
    hideBanner();
    return;
  }

  if (!banner) return;

  showBanner();
  banner.addEventListener('click', function (event) {
    var button = event.target.closest('[data-cookie-choice]');
    if (!button) return;
    setChoice(button.getAttribute('data-cookie-choice'));
  });
})();
