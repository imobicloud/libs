function windowOpened(e) {
    var activity = e.source.getActivity();
    if (activity) {
        activity.onCreateOptionsMenu = createMenuWindow;
        activity.actionBar && updateActionBar(activity.actionBar, Alloy.Globals.WinManager.getCache(-1));
    }
}

function tabgroupWindowOpened(e) {
    var activity = e.source.getActivity();
    if (activity && activity.actionBar) {
        activity.onCreateOptionsMenu = createMenuTabgroup;
        var tabgroup = Alloy.Globals.Tabgroup;
        updateActionBar(activity.actionBar, tabgroup.getCache(tabgroup.getActiveTab(), -1));
    }
}

function createMenuWindow(e) {
    createMenuItems(e, Alloy.Globals.WinManager.getCache(-1));
}

function createMenuTabgroup(e) {
    var tabgroup = Alloy.Globals.Tabgroup;
    createMenuItems(e, tabgroup.getCache(tabgroup.getActiveTab(), -1));
}

function createMenuItems(e, params) {
    var nav = params.controller.nav;
    if (nav) {
        var array = (nav.leftNavButton || []).concat(nav.rightNavButton || []);
        array.forEach(function(button) {
            var menuItem = e.menu.add(button);
            menuItem.addEventListener("click", button.callback);
        });
    }
}

function updateActionBar(actionBar, params) {
    var nav = params.controller.nav;
    nav.title && (actionBar.title = nav.title);
    nav.titleImage && (actionBar.icon = nav.titleImage);
    nav.backgroundImage && (actionBar.backgroundImage = nav.backgroundImage);
    if (false !== params.isReset) nav.homeAction && (actionBar.onHomeIconItemSelected = nav.homeAction); else {
        actionBar.displayHomeAsUp = true;
        actionBar.onHomeIconItemSelected = nav.backAction;
    }
}

var Alloy = require("alloy");

exports.load = function(params, controller, win, type) {
    win.addEventListener("open", "tabgroupWindow" != type ? windowOpened : tabgroupWindowOpened);
};

exports.update = function(nav, isTabgroup) {
    var params, win;
    if (true !== isTabgroup) {
        params = Alloy.Globals.WinManager.getCache(-1);
        win = params.controller.getView();
    } else {
        var tabgroup = Alloy.Globals.Tabgroup;
        params = tabgroup.getCache(tabgroup.getActiveTab(), -1);
        win = params.controller.getView();
        var activity = win.getActivity();
        if (activity) if (activity.actionBar) ; else {
            params = Alloy.Globals.WinManager.getCache(-1);
            win = params.controller.getView();
        }
    }
    params.controller.nav = nav;
    var activity = win.getActivity();
    if (activity) {
        activity.actionBar && updateActionBar(activity.actionBar, params);
        activity.invalidateOptionsMenu();
    }
};