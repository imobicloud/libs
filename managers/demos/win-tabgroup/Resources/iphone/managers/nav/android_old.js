var Alloy = require("alloy");

exports.load = function(params, controller, win) {
    win.navBarHidden = true;
    var headerbar = Alloy.createWidget("com.alco.headerbar");
    params.headerbar = headerbar;
    headerbar.setParentContainer(win);
    var nav = controller.nav;
    nav.backgroundImage && headerbar.setBackground({
        image: nav.backgroundImage
    });
    nav.titleImage && headerbar.setAppIcon(nav.titleImage);
    nav.title && headerbar.setTitle({
        text: nav.title,
        color: "#000"
    });
    if (false !== params.isReset) ; else {
        headerbar.setBlackAngle();
        headerbar.showAngle();
        nav.backAction && headerbar.setBack(nav.backAction);
    }
    var array = (nav.leftNavButton || []).concat(nav.rightNavButton || []), visible = [], inflater = [], androidmenu = [];
    array.forEach(function(button) {
        button.showAsAction === Ti.Android.SHOW_AS_ACTION_ALWAYS ? visible.push(button) : button.showAsAction === Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW ? inflater.push(button) : androidmenu.push(button);
    });
    headerbar.setActionButtons({
        visible: visible.length ? visible : null,
        inflater: inflater.length ? inflater : null,
        androidmenu: androidmenu.length ? androidmenu : null
    });
    win.children.length && (win.children[0].top = 50);
    var headerbarView = headerbar.getView();
    headerbarView.top = 0;
    win.add(headerbarView);
};

exports.update = function() {};