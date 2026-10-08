/* ==========================================================================
   Шапка: прячется при скролле вниз, появляется при скролле вверх.
   На первой секции прозрачная и белая, дальше белая с чёрным логотипом.
   ========================================================================== */
(function () {
    var header  = document.getElementById('siteHeader');
    var hero    = document.querySelector('.header_main');
    var body    = document.body;
    if (!header) return;

    /* ---------------- НАСТРОЙКИ ---------------- */
    var HIDE_AFTER_PX = 200;  // шапка начинает прятаться только после этой прокрутки страницы (px от верха)
    var HIDE_DELTA_PX = 60;   // сколько промотать ВНИЗ, чтобы шапка скрылась
    var SHOW_DELTA_PX = 40;   // сколько промотать ВВЕРХ, чтобы шапка появилась
    /* ------------------------------------------- */

    var lastY = 0, acc = 0, hidden = false;

    function getY() {
        return Math.max(window.pageYOffset || 0,
                        document.documentElement.scrollTop || 0,
                        document.body.scrollTop || 0);
    }

    function setHidden(v) {
        if (v === hidden) return;
        hidden = v;
        header.classList.toggle('is-hidden', v);
    }

    function update() {
        var y = getY();
        var d = y - lastY;
        lastY = y;

        /* цвет: прозрачная, пока видна первая секция */
        var heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
        header.classList.toggle('is-solid', heroBottom <= header.offsetHeight);

        if (body.classList.contains('menu-open')) { acc = 0; return; }

        /* считаем накопленную прокрутку в одну сторону */
        if ((d > 0 && acc < 0) || (d < 0 && acc > 0)) acc = 0;
        acc += d;

        if (acc > HIDE_DELTA_PX && y > HIDE_AFTER_PX) setHidden(true);
        else if (acc < -SHOW_DELTA_PX) setHidden(false);

        if (y <= 0) setHidden(false);
    }

    var ticking = false;
    document.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(function () { update(); ticking = false; });
        }
    }, { passive: true, capture: true });

    update();

    /* ---------- боковое меню ---------- */
    var burger  = document.getElementById('burgerBtn');
    var overlay = document.getElementById('menuOverlay');
    var closeBtn = document.getElementById('menuClose');

    function openMenu()  { body.classList.add('menu-open'); }
    function closeMenu() { body.classList.remove('menu-open'); }

    burger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

    /* вкладки Каталог / Информация */
    var tabs  = document.querySelectorAll('.side-menu__tabs button');
    var lists = document.querySelectorAll('.side-menu__list');
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (t) { t.classList.remove('active'); });
            lists.forEach(function (l) { l.classList.remove('active'); });
            tab.classList.add('active');
            document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
        });
    });
})();