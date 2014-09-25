function TabGroupManager() {
    function init(args) {
        UICaches = [];
        tabgroup = args.tabgroup;
        activeTab = args.defaultTab || 0;
        onFocus = args.onFocus || emptyFunction;
        onChange = args.onChange || emptyFunction;
        reloadTabAfterFocus = true;
        var tabs = [], oUIManager = require("managers/ui");
        for (var i = 0, ii = args.tabs.length; ii > i; i++) {
            var UIManager = new oUIManager(UIChange);
            UICaches.push(UIManager);
            var tab = args.tabs[i];
            tabs.push(Ti.UI.createTab({
                icon: tab.icon,
                title: tab.title,
                window: UIManager.set({
                    tabIndex: i,
                    url: tab.url,
                    data: tab.data,
                    isRoot: true
                })
            }));
        }
        tabgroup.setTabs(tabs);
        tabgroup.addEventListener("focus", tabGroupFocus);
        0 != activeTab && tabgroup.setActiveTab(activeTab);
        Ti.API.log("Tabgroup Manager: Initialize!");
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
    function winLoaded() {}
    function winDestroy(params, win) {
        if (params.isRoot) return;
        params.controller;
        false === params.isReset && win.removeEventListener("close", windowClosed);
        false !== params.isOpened && tabgroup.tabs[params.tabIndex].close(win);
        params.isOpened = false;
    }
    function load(params) {
        Ti.API.log("Tabgroup Manager: load Tab " + params.tabIndex + " - Page " + params.url + ": " + JSON.stringify(params.data));
        if (params.tabIndex != activeTab) {
            var prev = getCache(activeTab, -1);
            prev.controller.cleanup();
        }
        var win = UICaches[params.tabIndex].set(params);
        tabgroup.tabs[params.tabIndex].open(win);
        false === params.isReset && win.addEventListener("close", windowClosed);
        params.isOpened = true;
        if (params.tabIndex != activeTab) {
            reloadTabAfterFocus = false;
            tabgroup.setActiveTab(params.tabIndex);
            activeTab = params.tabIndex;
        }
        Ti.API.log("Tabgroup Manager: Tab " + params.tabIndex + " - Cached " + getCache(params.tabIndex).length);
    }
    function windowClosed() {
        getCache(activeTab, -1).isOpened = false;
        loadPrevious();
    }
    function loadPrevious(data, count) {
        UICaches[activeTab].setPrevious(data, count);
        Ti.API.log("Tabgroup Manager: Tab " + activeTab + " - Cached " + getCache(activeTab).length);
    }
    function getCache(tabIndex, cacheIndex) {
        return UICaches[tabIndex].get(cacheIndex);
    }
    function getActiveTab() {
        return activeTab;
    }
    function exit() {
        for (var i = UICaches.length - 1; i >= 0; i--) UICaches[i].reset();
        tabgroup = null;
        activeTab = null;
        UICaches.length = 0;
        Ti.API.log("Tabgroup Manager: Exit!");
    }
    function tabGroupFocus(e) {
        var tabIndex = e.index, previousIndex = e.previousIndex;
        if (-1 === previousIndex) return;
        activeTab = tabIndex;
        onFocus(tabIndex, previousIndex, tabgroup);
        if (previousIndex != tabIndex) {
            var prev = getCache(previousIndex, -1);
            prev.controller.cleanup();
        }
        if (false !== reloadTabAfterFocus) {
            var current = getCache(tabIndex, -1);
            current.controller.reload();
        }
        reloadTabAfterFocus = true;
        Ti.API.log("Tabgroup Manager: Tab " + tabIndex + " focussed! ");
    }
    function emptyFunction() {}
    var UICaches, tabgroup, onFocus, onChange, activeTab, reloadTabAfterFocus;
    return {
        init: init,
        load: load,
        loadPrevious: loadPrevious,
        getCache: getCache,
        getActiveTab: getActiveTab,
        exit: exit
    };
}

var Alloy = require("alloy");

module.exports = TabGroupManager;