function load(params, win, nav) {
    nav.titleControl ? win.titleControl = nav.titleControl : nav.titleImage ? win.titleImage = nav.titleImage : nav.title && (win.title = nav.title);
    var leftNavButton = nav.leftNavButton;
    leftNavButton ? win.leftNavButton = 1 == leftNavButton.length ? createNavButton(leftNavButton[0]) : createNavButtons(leftNavButton) : false == params.isReset && (win.backButtonTitle = "Back");
    var rightNavButton = nav.rightNavButton;
    rightNavButton && (win.rightNavButton = 1 == rightNavButton.length ? createNavButton(rightNavButton[0]) : createNavButtons(rightNavButton));
}

function createNavButtons(params) {
    var view = Ti.UI.createView({
        width: Ti.UI.SIZE,
        layout: "horizontal"
    });
    for (var i = 0, ii = params.length; ii > i; i++) view.add(createNavButton(params[i]));
    return view;
}

function createNavButton(params) {
    if (params.callback) {
        var button = Ti.UI.createButton({
            image: params.icon,
            backgroundImage: "NONE"
        });
        button.addEventListener("click", params.callback);
        return button;
    }
    return params;
}

var Alloy = require("alloy"), isIOS7 = true && parseInt(Ti.Platform.version.split(".")[0], 10) >= 7 ? true : false;

exports.load = function(params, controller, win) {
    load(params, win, controller.nav);
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
    }
    params.controller.nav = nav;
    load(params, win, nav);
};