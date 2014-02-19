function WindowManager(onChange) {
    function init() {
        var oUIManager = require("managers/ui");
        UIManager = new oUIManager(UIChange);
        Ti.API.log("Window Manager: initialized");
    }
    function UIChange(status, params, win) {
        if (false === onChange(status, params, win)) return false;
        var oSwitch = {
            0: winBeforeLoad,
            1: winLoaded,
            2: winDestroy
        };
        return oSwitch[status](params, win);
    }
    function winBeforeLoad() {}
    function winLoaded(params, win) {
        if (true && "Ti.UI.TabGroup" != win.apiName) if (false !== params.isReset) createNavigationWindow(params, win); else {
            var navigationWindow = getNavigationWindow();
            if (navigationWindow) {
                params.isOpened = true;
                win.addEventListener("close", windowClosed);
                navigationWindow.openWindow(win);
            } else createNavigationWindow(params, win);
        } else {
            win.open();
            false;
        }
    }
    function winDestroy(params, win) {
        if (true && "Ti.UI.TabGroup" != win.apiName) {
            if (params.navigationWindow) params.navigationWindow.close(); else if (false !== params.isOpened) {
                params.isOpened = false;
                win.removeEventListener("close", windowClosed);
                var navigationWindow = getNavigationWindow();
                navigationWindow.closeWindow(win);
            }
        } else win.close();
        Ti.API.log("Window Manager: Cached window: " + getCache().length);
    }
    function windowClosed() {
        getCache(-1).isOpened = false;
        loadPrevious();
    }
    function createNavigationWindow(params, win) {
        var navigationWindow = Ti.UI.iOS.createNavigationWindow({
            window: win
        });
        params.navigationWindow = navigationWindow;
        navigationWindow.open();
    }
    function getNavigationWindow() {
        var navigationWindow, cache = getCache();
        for (var i = cache.length - 1; i >= 0; i--) if (navWin = cache[i].navigationWindow) break;
        return navigationWindow;
    }
    function load(params) {
        Ti.API.log("Window Manager: Load window " + params.url + ": " + JSON.stringify(params.data));
        UIManager.set(params);
        Ti.API.log("Window Manager: Cached window: " + getCache().length);
    }
    function loadPrevious(data, count) {
        UIManager.setPrevious(data, count);
    }
    function getCache(index) {
        return UIManager.get(index);
    }
    function exit() {
        UIManager.reset();
        Ti.API.log("Window Manager: Exit!");
    }
    var UIManager;
    null == onChange && (onChange = function() {});
    init();
    return {
        load: load,
        loadPrevious: loadPrevious,
        getCache: getCache,
        exit: exit
    };
}

var Alloy = require("alloy");

module.exports = WindowManager;