export const themeInitScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      var initialTheme = theme || 'light';
      document.documentElement.setAttribute('data-theme', initialTheme);
    } catch (e) {}
  })();
`
