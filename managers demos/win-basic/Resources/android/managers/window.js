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
        win.open({
            animated: false !== params.animated
        });
        true && win.addEventListener("androidback", androidback);
    }
    function winDestroy(params) {
        if (true !== params._alreadyClosed) {
            fireEvent("window:hide", params);
            var win = params.controller.getView();
            win.removeEventListener("close", windowClosed);
            win.close({
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
        {
            var cache = getCache(-1);
            cache.controller.iosback;
        }
        cache._alreadyClosed = true;
        loadPrevious(null);
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
        var activity = Ti.Android.currentActivity;
        activity && activity.finish();
        Ti.API.log("Window Manager: Exit!");
    }
    function androidback() {
        var controller = getCache(-1).controller;
        if (controller.androidback && false === controller.androidback()) return;
        getCache().length > 1 ? loadPrevious() : fireEvent("window:exit");
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