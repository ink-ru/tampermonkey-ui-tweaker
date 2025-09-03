// ==UserScript==
// @name         YouTrack UI/UX enhancer
// @namespace    https://github.com/ink-ru/tampermonkey-ui-tweaker/tree/main/youtrack
// @version      0.0.1
// @description  YouTrack look & feel enhancer
// @author       https://white-ink.space
// @copyright    CopyLeft )
// @homepage     https://white-ink.space
// @match        https://youtrack.wildberries.ru/agiles/*
// @exclude      https://youtrack.wildberries.ru/issue/*
// @icon         https://wiki.wb.ru/assets/favicon.png
// @icon64       https://wiki.wb.ru/assets/favicon.svg?v=7c1bde
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
// @resource     styles https://raw.githubusercontent.com/ink-ru/tampermonkey-ui-tweaker/refs/heads/main/youtrack/youtrack.user.css?v=0.0.1
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

    function clck_handler(wb_btn) {
        GM_log('Button clicked!')
        
        document.querySelector("body").classList.toggle("custom_theme")

        var panels_state = -1
        panels_state = GM_getValue("panels_state", -1)
    }

    function wb_style_button(menu_bar)
    {
        const css = GM_getResourceText("styles")
        const button_html = '👀'
        GM_addStyle(css)
        
        waitForElm('.yt-agile-board__toolbar > ng-transclude').then((elm) => {

                let b_el = GM_addElement(elm, 'button', {
                  id: 'wb_ui_button',
                  class: 'button_a96a button_a96a heightS_efe7 buttonWithoutIcon_b3e8'
                });

                b_el.innerHTML += button_html

                document.querySelector('#wb_ui_button').addEventListener("click", function (e) {
                    clck_handler(this)
                });

                GM_log('Button added!')
            });
    }

    wb_style_button();

})();
