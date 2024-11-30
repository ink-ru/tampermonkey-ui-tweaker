// ==UserScript==
// @name         Wiki.js UI/UX enhancer
// @namespace    https://github.com/ink-ru/wikijs-ui-tweaker
// @version      0.1.1
// @description  Wiki.js look & feel enhancer
// @author       https://white-ink.space
// @copyright    CopyLeft )
// @homepage     https://white-ink.space
// @match        https://wikijs.wb.ru/*
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
// @resource     styles https://raw.githubusercontent.com/ink-ru/wikijs-ui-tweaker/refs/heads/main/wiki-js.user.css
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

    function add_event()
    {
        document.querySelector('.wb_btn').onclick = function()
        {

            document.querySelector("body").classList.toggle("wb_styled")

            document.querySelector(".page-col-content.is-page-header").classList.toggle("offset-xl-2")
            document.querySelector(".page-col-content.is-page-header").classList.toggle("offset-lg-3")

            document.querySelectorAll(".page-col-content").forEach(function(elmnt) {
                elmnt.classList.toggle("lg9")
                elmnt.classList.toggle("xl10")
                elmnt.classList.toggle("lg12")
                elmnt.classList.toggle("xl12")
            });

        }
    }

    function wb_style_button(menu_bar)
    {
        const css = GM_getResourceText("styles")
        const button_html = '<span class="v-btn__content"><b class="v-icon wb_btn">UI+</b></span>'

        GM_addStyle(css)

        waitForElm('#app .nav-header .v-toolbar__content .row > div:nth-child(1) header > div').then((elm) => {

                var b_el = GM_addElement(elm, 'span', {
                  id: 'wb_ui_button',
                  class: 'ml-2 mr-0 v-btn v-btn--flat v-btn--icon v-btn--round v-size--default'
                });

                b_el.innerHTML += button_html;

                add_event()

                GM_log('Button added!')
            });
    }

    wb_style_button();

})();

