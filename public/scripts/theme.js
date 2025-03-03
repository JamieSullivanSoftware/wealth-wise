(function () {
  //   let theme = '';

  if (typeof window !== 'undefined') {
    const bodyClass = window.document.body.classList;
    const theme = window.localStorage.getItem('color-theme');
    bodyClass.add('dark');
    console.log(bodyClass);
    console.log(theme);
  }

  //   console.log(localStorage);
  //   const preference = window.localStorage.getItem('color-theme');
  //   const hasExplicitPreference = typeof preference === 'string';
  //   /**
  //    * If the user has explicitly chosen light or dark,
  //    * use it. Otherwise, this value will be null.
  //    */
  //   if (hasExplicitPreference) {
  //     return preference;
  //   }
  //   console.log(preference);
  //   // "Sreetam Das"
})();
