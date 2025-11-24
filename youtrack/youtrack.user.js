// ==UserScript==
// @name         YouTrack UI/UX enhancer
// @namespace    https://github.com/ink-ru/tampermonkey-ui-tweaker/tree/main/youtrack
// @version      0.0.9
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
// @resource     styles https://raw.githubusercontent.com/ink-ru/tampermonkey-ui-tweaker/refs/heads/main/youtrack/youtrack.user.css?v=0.0.9
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

    function get_users()
    {
        const users = [...new Set(
                        [...document.querySelectorAll('yt-issue-custom-field-lazy[title^="Assignee:"]')]
                         .map(el => (el.getAttribute('title') || '')
                         .replace(/^Assignee:\s*/, '')
                         .replace(/\s+/, '_')
                        .trim()
                        )
                        .filter(Boolean)
                        )];

        if (users.length > 0)
        {
            GM_setValue("users_list", users)
            // GM_log('Users list has been updated!')
        }
        else GM_log('No users have been found, nothing to do!')
    }

    // ===========================================
    //          Remove all classes by part
    // ===========================================
    function clear_classList(el, part)
    {
        // DOM Object
        if('className' in el)
        {
            var classes = el.className.split(" ").filter(function(c) {
                return c.lastIndexOf(part, 0) !== 0
            })

            el.className = classes.join(" ").trim()

            return true // POSIX 0, EX_OK
        }
        // if((el instanceof NodeList) or (el instanceof Array))
        else if(typeof el[Symbol.iterator] === 'function')
        {
            for (const item of el) // NodeList
            {
              clear_classList(item, part)
            }
        }

        return false // POSIX 1 - general error
    }

    function toggle_boolValue(var_name)
    {
        if (typeof var_name === 'string')
        {

            try {
                GM_setValue(var_name, !GM_getValue(var_name, false))
                return true
            } catch (error) {
                GM_log(`Error inverting value for var "${var_name}":` + error)
                return false
            }
        }

        GM_log('Parameter must be a string');

        return false;
    }

    function ui_btn_clk_hdlr(e)
    {
        // Handle both event object and direct DOM element call
        const target = e && e.target ? e.target : (e instanceof Element ? e : this);

        document.querySelector("body").classList.toggle("custom_theme")
        target.classList.toggle('active_f231')
        if(!('fake' in e)) toggle_boolValue("custom_theme_state")
    }

    function wb_buttons(elm)
    {
        let b_el = GM_addElement(elm, 'button', {
            id: 'wb_ui_button',
            class: 'button_a96a button_a96a heightS_efe7 buttonWithoutIcon_b3e8'
        });

        // ========================
        // WB styles

        b_el.innerHTML += '👀'

        document.querySelector('#wb_ui_button').addEventListener("click", ui_btn_clk_hdlr.bind(b_el))

        if(GM_getValue("custom_theme_state", false)) ui_btn_clk_hdlr({ target: b_el, fake: true })

        // ========================
        // users
        let users_static = ['Жданов_Артём', 'Максим_Тёмкин', 'Максим_Темряков', 'Игорь_Петров', 'Yulian_Efimov', 'Курганов_Илья', 'Корпусов_Василий', 'Eduard_Goryanskiy', 'Svetlana_Novoseltseva', 'Yurii_Vasin', 'Unassigned']

        const users_saved = GM_getValue("users_list", users_static);
        const USER_CLASS_PREFIX = 'show_';

        let diff = users_saved.filter(element => !users_static.includes(element));
        let intersect = users_static.filter(element => users_saved.includes(element));

        const users = intersect.concat(diff);

        users.forEach((user) => {
          let new_el = GM_addElement(elm, 'button', {
            id: user + '_ui_button',
            title: '@' + user,
            class: 'button_a96a button_a96a heightS_efe7 buttonWithoutIcon_b3e8'
          });
          new_el.innerHTML += user;

          document.querySelector('#' + user + '_ui_button').addEventListener("click", function (e)
          {
              // GM_log(e.currentTarget === this)

              const body = document.body
              const btns = document.querySelectorAll('button[id$=_ui_button]')
              const currentClass = USER_CLASS_PREFIX + user

              clear_classList(btns, 'active_')

              // Если класс уже активен - убираем его
              if (body.classList.contains(currentClass))
              {
                  body.classList.remove(currentClass)
                  GM_log('User filter disabled!')
              }
              else
              {
                  // Убираем все классы пользователей
                  clear_classList(body, USER_CLASS_PREFIX)

                  // Добавляем класс текущего пользователя
                  body.classList.add(currentClass)
                  this.classList.add('active_f231')

                  GM_log('User filter enabled!')
              }
          });

        });


    }

     waitForElm('.yt-agile-board__toolbar > ng-transclude').then((elm) => {
         const css = GM_getResourceText("styles")
         GM_addStyle(css)

         wb_buttons(elm)
     });

    setTimeout(get_users, 20000)

})();
