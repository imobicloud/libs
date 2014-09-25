function TabGroupManager() {
    function init(args) {
        tabgroup = args.tabgroup;
        activeTab = args.defaultTab || 0;
        var arrayTab = args.tabs;
        var tabs = [], UIManager = require("managers/ui");
        for (var i = 0, ii = arrayTab.length; ii > i; i++) {
            var UICache = new UIManager();
            UICache.on("ui:show", winLoaded).on("ui:hide", winDestroy);
            UICaches.push(UICache);
            var tab = arrayTab[i];
            tabs.push(Ti.UI.createTab({
                icon: tab.icon,
                title: tab.title,
                window: UICache.load({
                    tabIndex: i,
                    url: tab.url,
                    data: tab.data,
                    _isRootWindow: true
                })
            }));
        }
        tabgroup.setTabs(tabs);
        tabgroup.addEventListener("focus", tabGroupFocus);
        false;
        0 != activeTab && tabgroup.setActiveTab(activeTab);
        Ti.API.log("Tabgroup Manager: Initialize!");
    }
    function winLoaded(params) {
        fireEvent("window:show", params);
    }
    function winDestroy(params) {
        fireEvent("window:hide", params);
        if (params._isRootWindow) return;
        if (true !== params._alreadyClosed) {
            var win = params.controller.getView();
            win.removeEventListener("close", windowClosed);
            tabgroup.tabs[params.tabIndex].close(win);
        }
    }
    function load(params) {
        Ti.API.log("Tabgroup Manager: load Tab " + params.tabIndex + " - Page " + params.url + ": " + JSON.stringify(params.data));
        var tabIndex = params.tabIndex;
        if (tabIndex != activeTab) {
            tabgroup.setActiveTab(tabIndex);
            activeTab = tabIndex;
        }
        if (params.url) {
            params.isReset = false;
            var win = UICaches[tabIndex].load(params);
            win.addEventListener("open", windowOpened);
            win.addEventListener("close", windowClosed);
            tabgroup.tabs[tabIndex].open(win);
        } else if (false !== params.isReset) {
            var len = getCache(activeTab).length;
            len > 1 ? loadPrevious(params.data, len - 1) : getCache(activeTab, -1).controller.reload(params.data);
        }
        Ti.API.log("Tabgroup Manager: Tab " + tabIndex + " - Cached " + getCache(tabIndex).length);
    }
    function windowOpened() {
        var cache = getCache(activeTab, -1), init = cache.controller.init;
        cache._alreadyInitialize = true;
        init && init(cache);
    }
    function windowClosed() {
        var cache = getCache(activeTab, -1), iosback = cache.controller.iosback;
        cache._alreadyClosed = true;
        loadPrevious(true && iosback ? iosback() : null);
    }
    function loadPrevious(data, count, isReload) {
        UICaches[activeTab].loadPrevious(data, count, isReload);
        Ti.API.log("Tabgroup Manager: Tab " + activeTab + " - Cached " + getCache(activeTab).length);
    }
    function getCache(tabIndex, cacheIndex) {
        -1 === tabIndex && (tabIndex = activeTab);
        return UICaches[tabIndex].get(cacheIndex);
    }
    function getActiveTab() {
        return activeTab;
    }
    function exit() {
        for (var i = UICaches.length - 1; i >= 0; i--) UICaches[i].reset();
        activeTab = null;
        events = null;
        tabgroup = null;
        UICaches = null;
        Ti.API.log("Tabgroup Manager: Exit!");
    }
    function tabGroupFocus(e) {
        var tabIndex = e.index, previousIndex = e.previousIndex;
        activeTab = tabIndex;
        if (-1 != previousIndex) {
            var prev = getCache(previousIndex, -1);
            prev.controller.cleanup();
        }
        var current = getCache(tabIndex, -1);
        if (current._alreadyInitialize) current.controller.reload(); else {
            current._alreadyInitialize = true;
            var init = current.controller.init;
            init && init(current);
        }
        Ti.API.log("Tabgroup Manager: Tab " + tabIndex + " focussed! ");
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
    function getView() {
        return tabgroup;
    }
    var activeTab, tabgroup, events = {}, UICaches = [];
    return {
        init: init,
        on: on,
        load: load,
        loadPrevious: loadPrevious,
        getCache: getCache,
        getView: getView,
        getActiveTab: getActiveTab,
        exit: exit
    };
}

module.exports = TabGroupManager;