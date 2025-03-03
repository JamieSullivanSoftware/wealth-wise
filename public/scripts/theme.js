(function () {
  if (typeof window !== 'undefined') {
    const bodyClass = window.document.body.classList;
    const theme = window.localStorage.getItem('color-theme');
    if (theme === 'dark') {
      bodyClass.add('dark');
      bodyClass.remove('light');
    } else {
      bodyClass.add('light');
      bodyClass.remove('dark');
    }
  }
})();
