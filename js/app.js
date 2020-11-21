var _ = {
    
    // determines the target of an event
    target : function (e) {
        return e.target || e.srcElement;
    }
};



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
        var lang = localStorage.getItem('lang');
        if (lang) {
            LANGUAGE.set(lang);
        }
    },
    
    // applies the given language type to the document
    set : function (lang) {
                
        // set the current language
        LANGUAGE.type = lang;
        document.documentElement.setAttribute('lang', lang);

        // save language in browser storage
        localStorage.setItem('lang', lang);
        
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
    LANGUAGE.init();
};