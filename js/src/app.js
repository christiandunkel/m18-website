'use strict';



/* Polyfill functions */

// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Polyfill
if (!Array.prototype['includes']) {
    Array.prototype.includes = function(searchElement, fromIndex) {
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        var len = o.length >>> 0;
        if (len === 0) {
            return false;
        }
        var n = fromIndex | 0;
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        function sameValueZero(x, y) {
            return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }
        while (k < len) {
            if (sameValueZero(o[k], searchElement)) {
                return true;
            }
            k++;
        }
        return false;
    };
}





// generic methods
var _ = {
    
    cookiesAreEnabled : function () {
        try {
            var cookie_name = 'cookies_enabled_test';
            localStorage.setItem(cookie_name, '{}');
            localStorage.getItem(cookie_name);
            return true;
        }
        catch (e) {
            return false;
        }
    },
    
    // determines the target of an event
    target : function (e) {
        return e.target || e.srcElement;
    },
    
    // checks if an element has a certain class
    hasClass : function (elem, class_) {
        return elem.classList.contains(class_);
    }
};



// manages anything related to the navigation bar
var NAVIGATION = {
    
    // saves references to all dropdown menus
    dropdown_menus : [],
    
    init : function () {
        NAVIGATION.initSearchBar();
        NAVIGATION.initMobileMenu();
        NAVIGATION.initDropdownMenus();
    },
    
    search_bar : null,
    search_bar_input : null,
    open_search_bar_btn : null,
    initSearchBar : function () {
        
        // detect the search bar element
        NAVIGATION.search_bar = document.getElementById('search-bar');
        NAVIGATION.search_bar_input = NAVIGATION.search_bar.getElementsByClassName('input')[0];
        
        // make it possible to close the search bar popup
        NAVIGATION.search_bar.getElementsByClassName('overlay')[0].addEventListener('click', function (e) {
            document.documentElement.classList.remove('search-bar-is-open');
            NAVIGATION.search_bar.classList.remove('show');
            NAVIGATION.open_search_bar_btn.focus();
        });
        NAVIGATION.search_bar.getElementsByClassName('close-btn')[0].addEventListener('click', function (e) {
            document.documentElement.classList.remove('search-bar-is-open');
            NAVIGATION.search_bar.classList.remove('show');
            NAVIGATION.open_search_bar_btn.focus();
        });
        
        // open the search bar with the click of a button
        NAVIGATION.open_search_bar_btn = document.getElementById('open-search-btn');
        NAVIGATION.open_search_bar_btn.addEventListener('click', function (e) {
            document.documentElement.classList.add('search-bar-is-open');
            NAVIGATION.search_bar.classList.add('show');
            NAVIGATION.search_bar_input.focus();
        });
    },
    
    initMobileMenu : function () {
        
        // enable hamburger button to open/close mobile navigation
        document.getElementById('mobile-hamburger-btn').addEventListener('click', function (e) {
            document.documentElement.classList.toggle('nav-is-open');
        });
        
        // add event to overlay in the mobile navigation
        var nav = document.getElementById('nav');
        nav.getElementsByClassName('overlay')[0].addEventListener('click', function (e) {
            document.documentElement.classList.remove('nav-is-open');
        });
        
        // toggles the opening of sub-dropdown menus in the mobile navigation
        var openers = document.getElementsByClassName('mobile-dropdown-opener');
        for (var i = 0, len = openers.length; i < len; i++) {
            openers[i].addEventListener('click', function (e) {
                _.target(e).classList.toggle('show');
            });
        }
    },
    
    // adds 'show' class to visible dropdown menus, to make them work in older browsers
    initDropdownMenus : function () {
        
        // get all dropdown menu elements
        NAVIGATION.dropdown_menus = document.getElementsByClassName('dropdown');
        if (!NAVIGATION.dropdown_menus) {
            return;
        }
        
        // iterate over all dropdown elements
        for (var i = 0, len = NAVIGATION.dropdown_menus.length; i < len; i++) {
            
            // get the HTML element
            var dropdown = NAVIGATION.dropdown_menus[i];
            
            // add certain events triggered by entering focus into the element
            dropdown.addEventListener('focusin', function (e) {

                // close all dropdown menus that may already be open
                for (var i = 0, len = NAVIGATION.dropdown_menus.length; i < len; i++) {
                    NAVIGATION.dropdown_menus[i].classList.remove('show');
                }

                // make all parent dropdown menus of the current focus target visible
                var target = _.target(e);
                while (
                    target &&
                    // go all the way up until the root element is reached
                    !['HTML', 'html'].includes(target.tagName)
                ) {
                    // if it's a dropdown menu, show it
                    if (_.hasClass(target, 'dropdown')) {
                        target.classList.add('show');
                    }
                    target = target.parentElement;
                }
            });
            
            // add certain events triggered by leaving focus from the element
            dropdown.addEventListener('focusout', function (e) {

                // after a while, test if focus is still inside a dropdown menu
                setTimeout(function () {
                    // get all the parent dropdown menus of the currently focussed on element
                    var target = document.activeElement;
                    var menus = [];
                    while (
                        target &&
                        // go all the way up until the root element is reached
                        !['HTML', 'html'].includes(target.tagName)
                    ) {
                        // if it's a dropdown menu, save a reference
                        if (_.hasClass(target, 'dropdown')) {
                            menus.push(target);
                        }
                        target = target.parentElement;
                    }
                    
                    // hide all other dropdown menus besides those containing the element the user currently focusses on
                    for (var i = 0, len = NAVIGATION.dropdown_menus.length; i < len; i++) {
                        if (!menus.includes(NAVIGATION.dropdown_menus[i])) {
                            NAVIGATION.dropdown_menus[i].classList.remove('show');
                        }
                    }
                }, 200);
            });
        }
    }
};



// manages language switches
var LANGUAGE = {
    
    // saves the current language type
    type : null,
    // holds references to all language changing buttons
    buttons : [],
    
    init : function () {
        
        LANGUAGE.buttons = document.getElementsByClassName('lang-select-btn');
        
        for (var i = 0, len = LANGUAGE.buttons.length; i < len; i++) {
            
            var btn = LANGUAGE.buttons[i];
            
            btn.addEventListener('click', function (e) {
                
                // determine language to be set
                var target = _.target(e);
                var lang = target.getAttribute('set-lang');
                
                LANGUAGE.set(lang);
            });
        }
        
        // set current language from browser cache
        if (_.cookiesAreEnabled()) {
            var lang = localStorage.getItem('lang');
            if (lang) {
                LANGUAGE.set(lang);
            }
        }
    },
    
    // applies the given language type to the document
    set : function (lang) {
                
        // set the current language
        LANGUAGE.type = lang;
        document.documentElement.setAttribute('lang', lang);

        // save language in browser storage
        if (_.cookiesAreEnabled()) {
            localStorage.setItem('lang', lang);
        }
        
        // set all language buttons to be clickable except for that of the current language
        for (var i = 0, len = LANGUAGE.buttons.length; i < len; i++) {
            
            var btn = LANGUAGE.buttons[i];
            var lang_ = btn.getAttribute('set-lang');
            
            if (lang === lang_) {
                btn.setAttribute('tabindex', '-1');
            }
            else {
                btn.removeAttribute('tabindex');
            }
        }
    }
};



/* MAIN */

window.onload = function () {
    NAVIGATION.init();
    LANGUAGE.init();
};