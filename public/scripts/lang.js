// Language script - handles language detection and application
(() => {
  const lang = (() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) {
      return localStorage.getItem('lang');
    }
    return 'es';
  })();

  document.documentElement.setAttribute('lang', lang);
})();