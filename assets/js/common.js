/* common */
$(function () {
    $('.header .btn-menu').on('click', (e) => {
        const target = $(e.target);
        const header = target.parents('.header');
        
        $('html').css('overflow', 'hidden');
        header.addClass('open');
    });

    $('.header .btn-close').on('click', (e) => {
        const target = $(e.target);
        const header = target.parents('.header');

        $('html').css('overflow', '');
        header.removeClass('open');
    });

    $('.header .lang .select').on('change', (e) => {
        const target = $(e.target);
        const lang = $(e.target).val();
        const targetUrl = (lang === 'ko') ? './index.html' : `./index_${lang}.html`;

        window.location.href = targetUrl;
    });

    setFullHeight();

    $(window).on('resize orientationchange', function () {
        setFullHeight();
    });
});

function setFullHeight() {
    let innerHeight = window.innerHeight;
    $('.header .nav-wrap').css('height', innerHeight + 'px');
}