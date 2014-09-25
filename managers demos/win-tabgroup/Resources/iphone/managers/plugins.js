function winBeforeLoad() {}

function winLoaded(params, win) {
    if (useNav) {
        var controller = params.controller;
        controller.nav && navigation.load(params, controller, win, "window");
    } else win.navBarHidden = true;
    "Ti.UI.TabGroup" != win.apiName && attachUtils(params, win);
}

function winDestroy(params) {
    if (params.ai) {
        params.ai.unload();
        params.ai = null;
        params.hiddenTextfield = null;
    }
}

function attachUtils(params, win) {
    var ai = Alloy.createController("elements/ai", {
        visible: true !== params.isRoot
    });
    params.ai = ai;
    win.add(ai.getView());
    var hiddenTextfield = Ti.UI.createTextField({
        visible: false
    });
    params.hiddenTextfield = hiddenTextfield;
    win.add(hiddenTextfield);
    true && win.addEventListener("singletap", function() {
        Ti.App.keyboardVisible && hideKeyboard();
    });
}

function hideKeyboard() {
    var current = Alloy.Globals.WinManager.getCache(-1), txt = current.hiddenTextfield;
    txt.focus();
    txt.blur();
}

function toggleAI(visible, message, timeout) {
    var current = Alloy.Globals.WinManager.getCache(-1);
    if (null == current || null == current.ai) {
        var tabgroup = Alloy.Globals.Tabgroup;
        current = tabgroup.getCache(tabgroup.getActiveTab(), -1);
    }
    visible ? current.ai.toggle(true, message, timeout) : current.ai.toggle(false);
}

var Alloy = require("alloy"), useNav = true, navigation;

if (useNav) {
    navigation = require("managers/nav/ios");
    exports.updateNav = navigation.update;
}

exports.windowChanged = function(status, params, win) {
    var oSwitch = {
        0: winBeforeLoad,
        1: winLoaded,
        2: winDestroy
    };
    return oSwitch[status](params, win);
};

exports.updateTabGroupNav = function(params) {
    useNav || (params.tabgroup.navBarHidden = true);
};

exports.tabGroupChanged = function(status, params, win) {
    if (0 == status) ; else if (1 == status) {
        var controller = params.controller;
        useNav && controller.nav ? navigation.load(params, controller, win, "tabgroupWindow") : win.navBarHidden = true;
        attachUtils(params, win);
    }
};

exports.tabGroupFocussed = function(currentIndex, previousIndex, tabgroup) {
    toggleAI(true);
    if (useNav && false) {
        var tabgroupController = Alloy.Globals.WinManager.getCache(-1).controller, currentTab = Alloy.Globals.Tabgroup.getCache(currentIndex, -1).controller;
        tabgroupController.nav = currentTab.nav;
        tabgroup.activity.invalidateOptionsMenu();
    }
};

exports.hideKeyboard = hideKeyboard;

exports.toggleAI = toggleAI;