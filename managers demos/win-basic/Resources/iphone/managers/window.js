function WindowManager() {
    function init() {
        var UIManager = require("managers/ui");
        UICache = new UIManager();
        UICache.on("ui:show", winLoaded).on("ui:hide", winDestroy);
        Ti.API.log("Window Manager: initialized");
    }
    function winLoaded(params) {
        fireEvent("window:show", params);
        var win = params.controller.getView();
        win.addEventListener("open", windowOpened);
        win.addEventListener("close", windowClosed);
        if (true && "Ti.UI.TabGroup" != win.apiName) if (false !== params.isReset) createNavigationWindow(params, win); else {
            var navigationWindow = getNavigationWindow();
            navigationWindow ? navigationWindow.openWindow(win, {
                animated: false !== params.animated
            }) : createNavigationWindow(params, win);
        } else {
            win.open({
                animated: false !== params.animated
            });
            false;
        }
    }
    function winDestroy(params) {
        if (true !== params._alreadyClosed) {
            fireEvent("window:hide", params);
            var win = params.controller.getView();
            win.removeEventListener("close", windowClosed);
            if (true && "Ti.UI.TabGroup" != win.apiName) if (params.navigationWindow) params.navigationWindow.close({
                animated: false !== params.animated
            }); else {
                var navigationWindow = getNavigationWindow();
                navigationWindow.closeWindow(win, {
                    animated: false !== params.animated
                });
            } else win.close({
                animated: false !== params.animated
            });
        }
        Ti.API.log("Window Manager: Cached window: " + getCache().length);
    }
    function windowOpened() {
        var cache = getCache(-1), init = cache.controller.init;
        init && init(cache);
    }
    function windowClosed() {
        var cache = getCache(-1), iosback = cache.controller.iosback;
        cache._alreadyClosed = true;
        loadPrevious(true && iosback ? iosback() : null);
    }
    function createNavigationWindow(params, win) {
        var navigationWindow = Ti.UI.iOS.createNavigationWindow({
            window: win
        });
        params.navigationWindow = navigationWindow;
        navigationWindow.open({
            animated: false !== params.animated
        });
    }
    function getNavigationWindow() {
        var navigationWindow, cache = getCache();
        for (var i = cache.length - 1; i >= 0; i--) if (navigationWindow = cache[i].navigationWindow) break;
        return navigationWindow;
    }
    function load(params) {
        Ti.API.log("Window Manager: Load window " + params.url + ": " + JSON.stringify(params.data));
        UICache.load(params);
        Ti.API.log("Window Manager: Cached window: " + getCache().length);
    }
    function getCache(index) {
        return UICache.get(index);
    }
    function reset() {
        UICache.reset();
        Ti.API.log("Window Manager: Reset!");
    }
    function loadPrevious(data, count, isReload) {
        return UICache.loadPrevious(data, count, isReload);
    }
    function loadPreviousOrReset(data, count, isReload) {
        count >= getCache().length ? reset() : loadPrevious(data, count, isReload) || reset();
    }
    function exit() {
        reset();
        Ti.API.log("Window Manager: Exit!");
    }
    function on(type, callback) {
        events[type] ? events[type].push(callback) : events[type] = [ callback ];
        return this;
    }
    function fireEvent(type, data) {
        var callbacks = events[type];
        if (callbacks) for (var i = 0, ii = callbacks.length; ii > i; i++) callbacks[i](data, {
            type: type
        });
    }
    var UICache, events = {};
    init();
    return {
        on: on,
        load: load,
        loadPrevious: loadPrevious,
        loadPreviousOrReset: loadPreviousOrReset,
        getCache: getCache,
        reset: reset,
        exit: exit
    };
}

module.exports = WindowManager;