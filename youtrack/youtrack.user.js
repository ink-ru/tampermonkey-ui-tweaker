// ==UserScript==
// @name         YouTrack UI/UX enhancer
// @namespace    https://github.com/ink-ru/tampermonkey-ui-tweaker/tree/main/youtrack
// @version      0.0.5
// @description  YouTrack look & feel enhancer
// @author       https://white-ink.space
// @copyright    CopyLeft )
// @homepage     https://white-ink.space
// @match        https://youtrack.wildberries.ru/agiles/*
// @exclude      https://youtrack.wildberries.ru/issue/*
// @icon         https://youtrack.jetbrains.com/manager/favicon.ico
// @icon64       https://youtrack.jetbrains.com/manager/apple-touch-icon.png
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_addElement
// @grant       GM_log
// @run-at       document-end
// @updateURL    https://github.com/ink-ru/tampermonkey-ui-tweaker/raw/refs/heads/main/youtrack/youtrack.user.js
// @downloadURL  https://github.com/ink-ru/tampermonkey-ui-tweaker/raw/refs/heads/main/youtrack/youtrack.user.js
// @supportURL   https://github.com//ink-ru/tampermonkey-ui-tweaker/issues
// @resource     styles https://raw.githubusercontent.com/ink-ru/tampermonkey-ui-tweaker/refs/heads/main/youtrack/youtrack.user.css?v=0.0.5
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

    function wb_buttons(elm)
    {
        let b_el = GM_addElement(elm, 'button', {
            id: 'wb_ui_button',
            class: 'button_a96a button_a96a heightS_efe7 buttonWithoutIcon_b3e8'
        });

        b_el.innerHTML += '👀'
        
        document.querySelector('#wb_ui_button').addEventListener("click", function (e) {
            // wb_style_clck_handler(this)
            document.querySelector("body").classList.toggle("custom_theme")
            e.classList.toggle('active_f231')
        });

        // ========================
        // @petrov.igor51
        let petrov_el = GM_addElement(elm, 'button', {
            id: 'petrov_ui_button',
            title: '@petrov.igor51',
            class: 'button_a96a button_a96a heightS_efe7 buttonWithoutIcon_b3e8'
        });

        petrov_el.innerHTML += 'Игорь'

        document.querySelector('#petrov_ui_button').addEventListener("click", function (e) {
            document.querySelector("body").classList.toggle("show_petrov")
            e.classList.toggle('active_f231')
        });
    }

     waitForElm('.yt-agile-board__toolbar > ng-transclude').then((elm) => {
         const css = GM_getResourceText("styles")
         GM_addStyle(css)
         
         wb_buttons(elm)
     });

})();
