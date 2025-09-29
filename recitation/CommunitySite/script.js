// wait for page to load
document.addEventListener('DOMContentLoaded', function() {

    // --- nav toggle ---
    var navToggle = document.querySelector('.nav-toggle');
    var navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });


    // --- artist filter ---
    var filterContainer = document.querySelector('.filters');
    var artistCards = document.querySelectorAll('.artist-card');

    if (filterContainer) {
        filterContainer.addEventListener('click', function(event) {
            
            // only run if a button was clicked
            if (event.target.tagName === 'BUTTON') {
                var genre = event.target.dataset.genre;

                // style the active button
                var currentActiveBtn = filterContainer.querySelector('.active');
                currentActiveBtn.classList.remove('active');
                event.target.classList.add('active');

                // loop over all cards to show/hide them
                for (var i = 0; i < artistCards.length; i++) {
                    var card = artistCards[i];
                    var cardGenre = card.dataset.genre;
                    
                    if (genre === 'all' || genre === cardGenre) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            }
        });
    }


    // --- dark mode toggle ---
    var themeSwitch = document.querySelector('#theme-switch');

    if (themeSwitch) {
        // use 'change' event for checkboxes
        themeSwitch.addEventListener('change', function(event) {
            if (event.target.checked) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        });
    }

});