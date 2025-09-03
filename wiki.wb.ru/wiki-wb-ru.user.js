// ==UserScript==
// @name         wiki.wb.ru UI/UX enhancer
// @namespace    https://github.com/ink-ru/tampermonkey-ui-tweaker
// @version      0.0.1
// @description  Wiki WB look & feel enhancer
// @author       https://white-ink.space
// @copyright    CopyLeft )
// @homepage     https://white-ink.space
// @match        https://wiki.wb.ru/space/*
// @exclude      https://wiki.wb.ru/pages
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
// @updateURL    https://raw.githubusercontent.com/ink-ru/tampermonkey-ui-tweaker/blob/main/wiki.wb.ru/wiki-wb-ru.user.js
// @downloadURL  https://raw.githubusercontent.com/ink-ru/tampermonkey-ui-tweaker/blob/main/wiki.wb.ru/wiki-wb-ru.user.js
// @supportURL   https://github.com//ink-ru/tampermonkey-ui-tweaker/issues
// @resource     styles https://raw.githubusercontent.com/ink-ru/tampermonkey-ui-tweaker/refs/heads/main/wiki.wb.ru/wiki-wb-ru.user.css?v=0.0.1
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

        var panels_state = -1
        panels_state = GM_getValue("panels_state", -1)
    }

    function wb_style_button(menu_bar)
    {
        const css = GM_getResourceText("styles")
        const button_html = '👀'
        GM_addStyle(css)
        
        waitForElm('.MuiStack-root:nth-child(2) .MuiStack-root > button.MuiButtonBase-root:first-child').then((elm) => {

                let b_el = GM_addElement(elm, 'button', {
                  id: 'wb_ui_button',
                  class: 'MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-wmu1fs'
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
