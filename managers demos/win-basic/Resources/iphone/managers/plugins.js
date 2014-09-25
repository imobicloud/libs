function Plugins(config) {
    function init() {
        _return.windowShow = windowShow;
        _return.windowHide = windowHide;
        config.ai && (_return.toggleAI = toggleAI);
        config.keyboard && (_return.hideKeyboard = hideKeyboard);
    }
    function windowShow(params) {
        var win = params.controller.getView();
        config.ai && loadAI(params, win);
        config.keyboard && loadKeyboard(params, win);
    }
    function windowHide(params) {
        if (config.ai && params._ai) {
            params._ai.unload();
            params._ai = null;
        }
        config.keyboard && (params._txt = null);
    }
    function loadAI(params, win) {
        var ai = Alloy.createController("elements/ai", {
            visible: true
        });
        params._ai = ai;
        win.add(ai.getView());
    }
    function toggleAI(visible, message, timeout) {
        if (visible) {
            var current = Alloy.Globals.WinManager.getCache(-1);
            null == current && (current = Alloy.Globals.Tabgroup.getCache(-1, -1));
            current && current._ai && current._ai.toggle(true, message, timeout);
        } else {
            var cache = Alloy.Globals.WinManager.getCache();
            0 === cache.length && (cache = Alloy.Globals.Tabgroup.getCache(-1));
            for (var i = 0, ii = cache.length; ii > i; i++) {
                var current = cache[i];
                current && current._ai && current._ai.toggle(false);
            }
        }
    }
    function loadKeyboard(params, win) {
        var txt = Ti.UI.createTextField({
            visible: false
        });
        params._txt = txt;
        win.add(txt);
        "true" != win.hasWebview && win.addEventListener("singletap", function(e) {
            -1 == [ "Ti.UI.TextField", "Ti.UI.TextArea", "Ti.UI.SearchBar", "Ti.UI.Android.SearchView" ].indexOf(e.source.apiName) && hideKeyboard();
        });
    }
    function hideKeyboard() {
        if (false || Ti.App.keyboardVisible) {
            var current = Alloy.Globals.WinManager.getCache(-1);
            null == current && (current = Alloy.Globals.Tabgroup.getCache(-1, -1));
            if (current && current._txt) {
                var txt = current._txt;
                txt.focus();
                txt.blur();
            }
        }
    }
    var _return = {};
    config = _.extend({
        ai: true,
        keyboard: true
    }, config);
    init();
    return _return;
}

var Alloy = require("alloy");

module.exports = Plugins;