// ==UserScript==
// @name         Wiki.js UI/UX enhancer
// @namespace    https://github.com/ink-ru/wikijs-ui-tweaker
// @version      0.1.1
// @description  Wiki.js look & feel enhancer
// @author       https://white-ink.space
// @copyright    CopyLeft )
// @homepage     https://white-ink.space
// @match        https://wikijs.wb.ru/*
// @exclude      https://wikijs.wb.ru/p/prof*
// @icon         https://js.wiki/favicons/favicon-32x32.png
// @icon64       https://js.wiki/favicons/apple-touch-icon.png
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_addElement
// @grant       GM_log
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/ink-ru/wikijs-ui-tweaker/main/wiki-js.user.js
// @downloadURL  https://raw.githubusercontent.com/ink-ru/wikijs-ui-tweaker/main/wiki-js.user.js
// @supportURL   https://github.com/ink-ru/wikijs-ui-tweaker/issues
// @resource     styles https://raw.githubusercontent.com/ink-ru/wikijs-ui-tweaker/refs/heads/main/wiki-js.user.css?v=1
// @tag         UI/UX
// @tag         wiki
// @tag         productivity
// ==/UserScript==

(function() { // https://www.tampermonkey.net/documentation.php
    'use strict';

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function hide_TOC()
    {
        document.querySelector("body").classList.add("UI_no_TOC")

        document.querySelector(".page-col-content.is-page-header").classList.remove("offset-xl-2")
        document.querySelector(".page-col-content.is-page-header").classList.remove("offset-lg-3")

        document.querySelectorAll(".page-col-content").forEach(function(elmnt) {
            elmnt.classList.remove("lg9")
            elmnt.classList.remove("xl10")
            elmnt.classList.add("lg12")
            elmnt.classList.add("xl12")
        });
    }

    function show_TOC()
    {
        document.querySelector("body").classList.remove("UI_no_TOC")

        document.querySelector(".page-col-content.is-page-header").classList.add("offset-xl-2")
        document.querySelector(".page-col-content.is-page-header").classList.add("offset-lg-3")

        document.querySelectorAll(".page-col-content").forEach(function(elmnt) {
            elmnt.classList.add("lg9")
            elmnt.classList.add("xl10")
            elmnt.classList.remove("lg12")
            elmnt.classList.remove("xl12")
        });
    }

    function hide_PTree()
    {
        document.querySelector('nav.v-navigation-drawer').style.display = "none"
        GM_setValue("main-padding", document.querySelector('.v-main').style.paddingLeft)
        document.querySelector('.v-main').style.paddingLeft = "0"
    }

    function show_PTree()
    {
        document.querySelector('nav.v-navigation-drawer').style.display = "flex";
        document.querySelector('.v-main').style.paddingLeft = GM_getValue("main-padding", '256px');
    }

    function show_All()
    {
        show_TOC()
        show_PTree()
    }

    function clck_handler(wb_btn) {
        // GM_log('Button clicked!')

            var panels_state = -1
            panels_state = GM_getValue("panels_state", -1)

            switch (panels_state) {
                case -1:
                    break
                case 2:
                    // Все панели видны, скрываем первую
                    panels_state = 1
                    hide_TOC()
                    wb_btn.innerHTML = '⏪'
                    break
                case 1:
                    // Одна панель видна, скрываем ее
                    panels_state = 0
                    hide_PTree()
                    wb_btn.innerHTML = '⏩'
                    break
              default: // 0
                    // Панели скрыты, возвращаем
                    panels_state = 2
                    show_All()
                    wb_btn.innerHTML = '⏹⏪'
                    break
            };
        GM_setValue("panels_state", panels_state)
    }

    function wb_style_button(menu_bar)
    {
        const css = GM_getResourceText("styles")
        const button_html = '<span class="v-btn__content"><b class="v-icon wb_btn">⏹⏪</b></span>'

        GM_addStyle(css)

        waitForElm('#app .nav-header .v-toolbar__content .row > div:nth-child(1) header > div').then((elm) => {

                let b_el = GM_addElement(elm, 'span', {
                  id: 'wb_ui_button',
                  class: 'ml-2 mr-0 v-btn v-btn--flat v-btn--icon v-btn--round v-size--default'
                });

                b_el.innerHTML += button_html

                document.querySelector('.wb_btn').addEventListener("click", function (e) {
                    clck_handler(this)
                });

                GM_log('Button added!')
            });
    }

    wb_style_button();

})();

