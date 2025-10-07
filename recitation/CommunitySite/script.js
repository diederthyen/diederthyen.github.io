// script.js - nav, filters, theme+lang persistence, expiry, clear-data, i18n, container-safe
document.addEventListener('DOMContentLoaded', function () {

  // -----------------------
  // NAV TOGGLE (mobile)
  // -----------------------
  var navToggle = document.querySelectorAll('.nav-toggle');
  var navMenus = document.querySelectorAll('.nav-menu');


  // -----------------------
  // i18n small map (expandable)
  // -----------------------
  const TEXT = {
    en: {
      navHome: 'Home',
      navArtists: 'Artists',
      navGigs: 'Gigs',
      navEvents: 'Events',
      navPost: 'Post a Gig',
      heroHeading: "Connecting Boulder's Music Scene",
      heroSub: "Find local artists, discover upcoming gigs, and connect with the community.",
      upcoming: "Upcoming Gigs",
      featured: "Featured Artists",
      featuredBlurb: "Check out our full artist directory to find musicians for your next event.",
      browse: "Browse Artists",
      filter: "Filter Artists"
    },
    es: {
      navHome: 'Inicio',
      navArtists: 'Artistas',
      navGigs: 'Conciertos',
      navEvents: 'Eventos',
      navPost: 'Publicar',
      heroHeading: "Conectando la escena musical de Boulder",
      heroSub: "Encuentra artistas locales, descubre conciertos y conecta con la comunidad.",
      upcoming: "Próximos conciertos",
      featured: "Artistas destacados",
      featuredBlurb: "Consulta nuestro directorio completo para encontrar músicos para tu próximo evento.",
      browse: "Ver artistas",
      filter: "Filtrar artistas"
    }
  };

  navToggle.forEach(function(btn){
    btn.addEventListener('click', function(){
      // find nearest nav-menu (page has a single one)
      var menu = document.querySelector('.nav-menu');
      if (!menu) return;
      menu.classList.toggle('show');
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', (!expanded).toString());
    });
  });

  // -----------------------
  // ARTIST FILTER
  // -----------------------
  var filterContainer = document.querySelector('.filters');
  var artistCards = document.querySelectorAll('.artist-card');

  if (filterContainer) {
    filterContainer.addEventListener('click', function (event) {
      if (event.target.tagName === 'BUTTON') {
        var genre = event.target.dataset.genre;

        var currentActiveBtn = filterContainer.querySelector('.active');
        if (currentActiveBtn) currentActiveBtn.classList.remove('active');
        event.target.classList.add('active');

        artistCards.forEach(function (card) {
          var cardGenre = card.dataset.genre;
          if (genre === 'all' || genre === cardGenre) card.classList.remove('hidden');
          else card.classList.add('hidden');
        });
      }
    });
  }



  // -----------------------
  // THEME + LANGUAGE + PREFS
  // -----------------------
  (function () {
    const KEY = 'bma_prefs';
    const EXP_MS = 1000 * 60 * 60 * 24 * 180; // 180 days
    const themeBtn = document.getElementById('themeToggle');
    const langSelects = document.querySelectorAll('#langSelect');
    const clearBtn = document.getElementById('clearPrefs');
    const status = document.getElementById('prefsMsg');
    const legacySwitch = document.getElementById('theme-switch'); // Get legacy switch

    function now() { return Date.now(); }

    function readPrefs() {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return {};
        return JSON.parse(raw);
      } catch (e) {
        return {};
      }
    }

    function savePrefs(p) {
      try {
        p.ts = now();
        localStorage.setItem(KEY, JSON.stringify(p));
      } catch (e) {
        // storage failed (private mode), ignore
      }
    }

    function applyPrefs(p) {
      const theme = p.theme || 'light';
      const lang = p.lang || 'en';
      document.documentElement.className = theme;
      document.documentElement.lang = lang;

      // update header button state
      if (themeBtn) {
        themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        themeBtn.textContent = theme === 'dark' ? 'dark mode' : 'light mode';
      }
      
      // update legacy checkbox state to match
      if (legacySwitch) {
        legacySwitch.checked = (theme === 'dark');
      }

      // update language select state
      if (langSelects.length) {
        langSelects.forEach(function(s){ s.value = lang; });
      }

      updateTextForLang(lang);
    }

    function showStatus(msg) {
      if (!status) return;
      status.textContent = msg;
      setTimeout(function(){ status.textContent = ''; }, 1800);
    }

    // expiry check + init
    (function init(){
      const p = readPrefs();
      if (p.ts && (now() - p.ts) > EXP_MS) {
        try { localStorage.removeItem(KEY); } catch(e){}
        applyPrefs({theme:'light', lang:'en'});
      } else {
        applyPrefs(p);
      }
    })();

    // theme toggle handler (header)
    if (themeBtn) {
      themeBtn.addEventListener('click', function() {
        const cur = document.documentElement.className || 'light';
        const next = cur === 'light' ? 'dark' : 'light';
        const p = Object.assign({}, readPrefs(), { theme: next, lang: (document.documentElement.lang || 'en') });
        savePrefs(p);
        applyPrefs(p);
        showStatus(next === 'dark' ? 'dark mode' : 'light mode');
      });
    }

    // language handler(s)
    if (langSelects.length) {
      langSelects.forEach(function(sel){
        sel.addEventListener('change', function(){
          const p = Object.assign({}, readPrefs(), { lang: sel.value, theme: document.documentElement.className || 'light' });
          savePrefs(p);
          applyPrefs(p);
          showStatus(sel.value === 'es' ? 'idioma guardado' : 'language saved');
        });
      });
    }

    // clear prefs
    if (clearBtn) {
      clearBtn.addEventListener('click', function(){
        try { localStorage.removeItem(KEY); } catch(e){}
        applyPrefs({theme:'light', lang:'en'});
        showStatus('preferences cleared');
      });
    }
    
    // Connect legacy switch to main theme button
    if (legacySwitch) {
      legacySwitch.addEventListener('change', function () {
        if (themeBtn) {
          themeBtn.click(); // Trigger the main button's click event
        }
      });
    }
  })();

  function updateTextForLang(lang) {
    const map = TEXT[lang] || TEXT.en;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      const key = el.getAttribute('data-i18n');
      if (map[key]) el.textContent = map[key];
    });
  }

  // ensure text is right on load
  updateTextForLang(document.documentElement.lang || 'en');

  // -----------------------
  // end DOMContentLoaded
  // -----------------------
});