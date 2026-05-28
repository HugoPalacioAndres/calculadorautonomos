// =====================
// GESTIÓN DE CONSENTIMIENTO DE COOKIES
// RGPD — Europa
// =====================

const COOKIE_KEY = 'cookie_consent';

function setCookieConsent(value) {
  localStorage.setItem(COOKIE_KEY, value);
}

function getCookieConsent() {
  return localStorage.getItem(COOKIE_KEY);
}

function loadAnalytics() {
  if (typeof gtag !== 'undefined') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }
}

function rejectAnalytics() {
  if (typeof gtag !== 'undefined') {
    gtag('consent', 'update', { analytics_storage: 'denied' });
  }
}

function acceptCookies() {
  setCookieConsent('accepted');
  hideBanner();
  loadAnalytics();
}

function rejectCookies() {
  setCookieConsent('rejected');
  hideBanner();
  rejectAnalytics();
}

function hideBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  banner.style.animation = 'slideOutDown 0.3s ease forwards';
  setTimeout(() => { banner.style.display = 'none'; }, 300);
}

function resetCookieConsent() {
  localStorage.removeItem(COOKIE_KEY);
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.style.display = 'block';
    banner.style.animation = 'slideInUp 0.35s cubic-bezier(0.4,0,0.2,1) forwards';
  }
}

function initCookieBanner() {
  const consent = getCookieConsent();
  const banner = document.getElementById('cookie-banner');

  if (!banner) return;

  if (!consent) {
    banner.style.display = 'block';
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'default', { analytics_storage: 'denied' });
    }
  } else if (consent === 'accepted') {
    loadAnalytics();
  } else {
    rejectAnalytics();
  }
}

document.addEventListener('DOMContentLoaded', initCookieBanner);