/* common */
$(function () {
    let scrollTop, lastScrollTop = 0;
    let windowWidth = $(window).width();
    let counted = false;

    const uiCommon = {
        init: () => {
            uiCommon.resize();
            uiCommon.scroll();
            
            uiCommon.selectBox();
            uiCommon.btnMenuClick();
            uiCommon.btnBottomFixed();
            uiCommon.topBannerFixed();
            uiCommon.mainSecKvHeight();
            uiCommon.modalOpen();
            uiCommon.modalClose();
            uiCommon.aniCounter();
            uiCommon.tabInit();
            uiCommon.tabBtnClick();
            uiCommon.inputDisabled();

            // let number = $('.ani-counter').text().replace(/\D/g, '');
            // $('.ani-counter').rollingNum({
            //     number: number
            // });
        },
        resize: () => {
            $(window).resize(() => {
                windowWidth = $(this).width();

                uiCommon.topBannerFixed();
                uiCommon.mainSecKvHeight();
            });
        },
        scroll: () => {
            $(window).on('scroll', () => {
                scrollTop = $(this).scrollTop();
                uiCommon.btnScrollShow();
                uiCommon.aniCounter();
            });
        },
        selectBox: () => {
            $('.select').each((idx, el) => {
                const $wrapper = $(el);
                const $select = $wrapper.find('select');
                const options = $select.find('option');
                const placeholder = $select.find('.placeholder').text() || "선택하세요";

                if(!$wrapper.length) return;
                
                let html = `
                    <div class="ui-select" role="combobox" aria-haspopup="listbox" aria-expanded="false" tabindex="0">
                        <p class="value-txt placeholder">${placeholder}</p>
                        <ul class="option-list" role="listbox">
                `;

                options.each((idx, el) => {
                    const value = $(el).val();
                    const text = $(el).text();

                    if($(el).hasClass('placeholder')) return;
                    html += `<li class="option" role="option" tabindex="0" data-value="${value}">${text}</li>`
                });

                html += `</ul></div>`;
                $wrapper.append(html);
                
                const $uiSelect = $wrapper.find('.ui-select');
                const $value = $uiSelect.find('.value-txt');
                const $list = $uiSelect.find('.option-list');
                const $items = $list.find('.option');

                $uiSelect.on('click', function (e) {
                    e.stopPropagation();
                    toggleOptions();
                });

                $items.on('click', function (e) {
                    e.stopPropagation();
                    selectOption($(this));
                    setTimeout(() => {
                        closeOptions();
                    }, 100);
                });

                $(document).on('click', function (e) {
                    if (!$(e.target).closest('.select').length) {
                        closeOptions();
                    }
                });

                // 키보드 접근성
                $wrapper.on('keydown', function (e) {
                    keyboardClick();
                });

                // <select> 변경 시 UI 반영
                $select.on('change', function () {
                    const selectedVal = $(this).val();
                    const $matched = $items.filter(`[data-value="${selectedVal}"]`);
                    if ($matched.length) {
                        $value.text($matched.text()).removeClass('placeholder');
                        $items.attr('aria-selected', 'false');
                        $matched.attr('aria-selected', 'true');
                    }

                    //컨텐츠 show
                    const selectedOption = $(this).find('option:selected');
                    const visibleTarget = selectedOption.data('visible');
                    const inputWrap = selectedOption.parents('.input-wrap');

                    $('.input').removeClass('show');

                    if (visibleTarget) {
                        inputWrap.find('.' + visibleTarget).addClass('show');
                    }
                });

                function toggleOptions() {
                    const isOpen = $uiSelect.attr('aria-expanded') === 'true' ? true : false;
                    $uiSelect.attr('aria-expanded', !isOpen);
                    $select.attr('aria-expanded', !isOpen);
                }

                function closeOptions() {
                    $select.attr('aria-expanded', 'false');
                    $uiSelect.attr('aria-expanded', 'false');
                }

                function selectOption($option) {
                    const value = $option.data('value');
                    const label = $option.text();

                    $value.text(label).removeClass('placeholder');
                    $select.val(value).trigger('change');

                    $items.attr('aria-selected', 'false');
                    $option.attr('aria-selected', 'true');
                }

                // 키보드 접근성
                function keyboardClick(e) {
                    const $focused = $(':focus');
                    const currentIndex = $items.index($focused);

                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (!$itemsList.hasClass('open')) toggleOptions();
                        const $next = $items.eq((currentIndex + 1) % $items.length);
                        $next.focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (!$itemsList.hasClass('open')) toggleOptions();
                        const $prev = $items.eq((currentIndex - 1 + $items.length) % $items.length);
                        $prev.focus();
                    } else if (e.key === 'Enter') {
                        if ($focused.hasClass('option')) {
                            selectOption($focused);
                        } else {
                            toggleOptions();
                        }
                    } else if (e.key === 'Escape') {
                        closeOptions();
                    }
                }
            });
        },
        btnMenuClick: () => {
            $('.header .btn-menu').on('click', (e) => {
               const mobMenu = $(e.target).parents('.header').children('.mob-menu'); 
               
               mobMenu.addClass('open');
               $('html').css('overflow', 'hidden');
            });
            $('.header .mob-menu .btn-close').on('click', (e) => {
               const mobMenu = $(e.target).parents('.header').children('.mob-menu'); 
               
               mobMenu.removeClass('open');
               $('html').css('overflow', '');
            });
            $('.header .mob-menu .mob-nav a').on('click', (e) => {
               const mobMenu = $(e.target).parents('.header').children('.mob-menu'); 
               
               mobMenu.removeClass('open');
               $('html').css('overflow', '');
            });
        },
        btnBottomFixed: () => {
            if($('.btn-fixed').length){
                $('.btn-fixed').each((idx, el) => {
                    const fixedHeight = $(el).innerHeight();
                    const paddingBottom = windowWidth > 360 ? `${fixedHeight * 0.1}rem` : `${(fixedHeight / windowWidth) * 100}vw`;
                    const contents = $(el).parents('.contents');
    
                    contents.css('padding-bottom', `${paddingBottom}`);
                });
            }
        },
        topBannerFixed: () => {
            if($('.fixed-top-banner').length){
                const topBanner = $('.fixed-top-banner').innerHeight();
                const header = $('.header');
    
                header.css('top', topBanner * 0.1 + 'rem');
            }
        },
        mainSecKvHeight: () => {
            if($('.wrap.main .sec-kv').length){
                const secKv = $('.wrap.main .sec-kv');
                const fixedHeight = $('.header').innerHeight() + $('.fixed-top-banner').innerHeight();
    
                secKv.css('height', `calc(100vh - ${fixedHeight * 0.1}rem)`);
            }
        },
        btnScrollShow: () => {
            const btnScroll = $('.btn-scroll');

            // btnScroll.each((idx, el) => {
            //     if(scrollTop > lastScrollTop) {
            //         $(el).addClass('show');
            //     } else if(scrollTop < lastScrollTop) {
            //         $(el).removeClass('show');
            //     }
            // });

            // lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            
            btnScroll.each((idx, el) => {
                if(scrollTop > 10) {
                    $(el).addClass('show');
                } else if(scrollTop === 0){
                    $(el).removeClass('show');
                }
            });
        },
        modalOpen: () => {
            $('.btn').on('click', (e) => {
                const dataModal = $(e.target).data('modal');

                if(dataModal){
                    $(`#${dataModal}`).addClass('open');
                    $('html').css('overflow', 'hidden');
                }
            });
        },
        modalClose: (e) => {
            if(e){
                const modal = $(e.target).parents('.modal');

                modal.removeClass('open');
                $('html').css('overflow', '');
            }
            $('.btn-close').on('click', (e) => {
                const modal = $(e.target).parents('.modal');

                modal.removeClass('open');
                $('html').css('overflow', '');
            });

            $('.modal').on('click', (e) => {
                const target = $(e.target);
                const modal = target.parents('.modal');

                if(target.hasClass('dimd')){
                    modal.removeClass('open');
                    $('html').css('overflow', '');
                }
            });
        },
        aniCounter: () => {
            if($('.ani-counter').length){
                const $counter = $('.ani-counter');
                const offset = $counter.offset().top - window.innerHeight + 100;

                if (!counted && scrollTop > offset) {
                    counted = true;

                    $('.ani-counter').each((idx, el) => {
                        let $this = $(el);
                        let target = parseInt($this.attr('data-count'), 10);
                        // let numWidth = document.querySelector('.ani-counter').getBoundingClientRect().width;
    
                        // $this.css('width', numWidth*1.1);
    
                        $({ countNum: 0 }).animate(
                            { countNum: target },
                            {
                                duration: 1500, // 1.5초 동안
                                easing: 'swing',
                                step: function () {
                                    $this.text(Math.floor(this.countNum).toLocaleString());
                                },
                                complete: function () {
                                    $this.text(target.toLocaleString()); // 마지막 숫자 정확히 설정
                                }
                            }
                        );
                    });
                }
            }
        },
        tabInit: () => {
            $('.tab .tab-btns .tab-btn.active').each((idx, el) => {
                tabFn(el);
            });
        },
        tabBtnClick: () => {
            $('.tab .tab-btns .tab-btn').on('click', (e) => {
                tabFn(e.target);
             });
        },
        inputDisabled: () => {
            $('.input input:disabled').each((idx, el) => {
                $(el).parents('.input').addClass('disabled');
            });
        },
    }

    //실행
    uiCommon.init();
});

function modalOpen(modal) {
    if(modal){
        $(`#${modal}`).addClass('open');
        $('html').css('overflow', 'hidden');
    }
}

function modalClose(el){
    const target = $(el);
    const modal = target.parents('.modal');

    modal.removeClass('open');
    $('html').css('overflow', '');
}

function tabFn(target){
    const tab = $(target);
    const tabIdx = tab.index();
    const tabPnls = tab.parents('.tab').find('.tab-pnls .tab-pnl');

    tab.addClass('active').siblings().removeClass('active');
    tabPnls.eq(tabIdx).addClass('show').siblings().removeClass('show');
}