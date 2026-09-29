(function ($) {
    "use strict";

    /* =========================================================
       STICKY NAVBAR
    ========================================================= */

    function handleStickyNavbar() {
        if ($(window).scrollTop() > 40) {
            $('.navbar').addClass('sticky-top');
        } else {
            $('.navbar').removeClass('sticky-top');
        }
    }

    $(window).on('scroll', handleStickyNavbar);
    $(document).ready(handleStickyNavbar);


    /* =========================================================
       RESPONSIVE NAVBAR DROPDOWN
    ========================================================= */

    function toggleNavbarMethod() {

        // Remove previously attached hover events
        $('.navbar .dropdown')
            .off('mouseenter mouseleave');

        // Desktop
        if ($(window).width() > 991) {

            $('.navbar .dropdown').on('mouseenter', function () {
                $(this)
                    .find('.dropdown-toggle')
                    .attr('aria-expanded', 'true');

                $(this)
                    .find('.dropdown-menu')
                    .addClass('show');
            });

            $('.navbar .dropdown').on('mouseleave', function () {
                $(this)
                    .find('.dropdown-toggle')
                    .attr('aria-expanded', 'false');

                $(this)
                    .find('.dropdown-menu')
                    .removeClass('show');
            });

        } else {

            // Mobile/tablet
            $('.navbar .dropdown-toggle').off('click.responsiveDropdown');

            $('.navbar .dropdown-toggle').on(
                'click.responsiveDropdown',
                function (e) {

                    e.preventDefault();

                    var $dropdown = $(this).closest('.dropdown');
                    var $menu = $dropdown.find('.dropdown-menu');

                    // Close other dropdowns
                    $('.navbar .dropdown-menu')
                        .not($menu)
                        .removeClass('show');

                    // Toggle current dropdown
                    $menu.toggleClass('show');

                    $(this).attr(
                        'aria-expanded',
                        $menu.hasClass('show') ? 'true' : 'false'
                    );
                }
            );
        }
    }

    $(document).ready(function () {
        toggleNavbarMethod();
    });

    $(window).on('resize', function () {
        toggleNavbarMethod();
    });


    /* =========================================================
       CLOSE MOBILE MENU AFTER CLICK
    ========================================================= */

    $(document).on('click', '.navbar .nav-link:not(.dropdown-toggle)', function () {

        if ($(window).width() <= 991) {

            var $navbarCollapse = $('.navbar-collapse');

            if ($navbarCollapse.hasClass('show')) {

                if (typeof bootstrap !== 'undefined') {

                    var collapseElement =
                        document.querySelector('.navbar-collapse');

                    if (collapseElement) {

                        var collapse =
                            bootstrap.Collapse.getInstance(collapseElement);

                        if (!collapse) {
                            collapse =
                                new bootstrap.Collapse(
                                    collapseElement,
                                    { toggle: false }
                                );
                        }

                        collapse.hide();
                    }

                } else {
                    $navbarCollapse.removeClass('show');
                }
            }
        }
    });


    /* =========================================================
       MODAL VIDEO
    ========================================================= */

    $(document).ready(function () {

        var $videoSrc = '';

        $('.btn-play').on('click', function () {
            $videoSrc = $(this).data('src');
        });

        $('#videoModal').on('shown.bs.modal', function () {

            if ($videoSrc) {

                var separator =
                    $videoSrc.indexOf('?') !== -1 ? '&' : '?';

                $('#video').attr(
                    'src',
                    $videoSrc +
                    separator +
                    'autoplay=1&modestbranding=1&showinfo=0'
                );
            }
        });

        $('#videoModal').on('hide.bs.modal', function () {

            if ($videoSrc) {
                $('#video').attr('src', $videoSrc);
            } else {
                $('#video').attr('src', '');
            }
        });

    });


    /* =========================================================
       BACK TO TOP BUTTON
    ========================================================= */

    function handleBackToTop() {

        if ($(window).scrollTop() > 100) {
            $('.back-to-top').stop(true, true).fadeIn('slow');
        } else {
            $('.back-to-top').stop(true, true).fadeOut('slow');
        }
    }

    $(window).on('scroll', handleBackToTop);

    $('.back-to-top').on('click', function (e) {

        e.preventDefault();

        $('html, body').animate(
            {
                scrollTop: 0
            },
            1000,
            'easeInOutExpo'
        );

        return false;
    });


    /* =========================================================
       FACTS COUNTER
    ========================================================= */

    $(document).ready(function () {

        if ($.fn.counterUp) {

            $('[data-toggle="counter-up"]').counterUp({
                delay: 10,
                time: 2000
            });

        }
    });


    /* =========================================================
       RESPONSIVE TESTIMONIAL CAROUSEL
    ========================================================= */

    function initializeTestimonialCarousel() {

        var $carousel = $('.testimonial-carousel');

        if (!$carousel.length || !$.fn.owlCarousel) {
            return;
        }

        // Destroy existing carousel before reinitializing
        if ($carousel.hasClass('owl-loaded')) {
            $carousel.trigger('destroy.owl.carousel');
            $carousel.removeClass('owl-loaded');
            $carousel.find('.owl-stage-outer').children().unwrap();
        }

        var windowWidth = $(window).width();

        var items = 1;
        var margin = 15;

        if (windowWidth >= 992) {
            items = 3;
            margin = 45;
        } else if (windowWidth >= 768) {
            items = 2;
            margin = 30;
        } else if (windowWidth >= 576) {
            items = 1;
            margin = 20;
        } else {
            items = 1;
            margin = 10;
        }

        $carousel.owlCarousel({
            autoplay: true,
            autoplayTimeout: 4000,
            autoplayHoverPause: true,
            smartSpeed: 1000,
            margin: margin,
            dots: true,
            nav: false,
            loop: true,
            center: windowWidth >= 768,
            responsive: {
                0: {
                    items: 1,
                    margin: 10,
                    center: false
                },

                576: {
                    items: 1,
                    margin: 20,
                    center: false
                },

                768: {
                    items: 2,
                    margin: 30,
                    center: true
                },

                992: {
                    items: 3,
                    margin: 45,
                    center: true
                }
            }
        });
    }

    $(document).ready(function () {
        initializeTestimonialCarousel();
    });


    /* =========================================================
       RESPONSIVE RESIZE HANDLER
    ========================================================= */

    var resizeTimer;

    $(window).on('resize', function () {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {

            toggleNavbarMethod();

        }, 200);
    });


    /* =========================================================
       PREVENT HORIZONTAL OVERFLOW
    ========================================================= */

    $(document).ready(function () {

        // Make oversized images responsive
        $('img').css({
            'max-width': '100%',
            'height': 'auto'
        });

        // Make videos responsive
        $('iframe, video').css({
            'max-width': '100%'
        });

    });


})(jQuery);
