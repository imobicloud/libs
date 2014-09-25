function createNavButtons(params) {
    var view = Ti.UI.createView({
        width: Ti.UI.SIZE,
        layout: "horizontal"
    });
    for (var i = 0, ii = params.length; ii > i; i++) {
        var button = createNavButton(params[i]);
        view.add(button);
    }
    return view;
}

function createNavButton(params) {
    if (params.callback) {
        var button = Ti.UI.createButton({
            backgroundImage: "NONE"
        });
        if (params.icon) {
            button.image = params.icon;
            if (null == params.title) {
                button.height = 34;
                button.width = 40;
            }
        }
        params.title && (button.title = params.title);
        button.addEventListener("click", params.callback);
        return button;
    }
    return params;
}

exports.load = function(win, nav) {
    if (nav.titleControl) {
        Alloy.Globals.isIOS7 && (nav.titleControl.borderColor = nav.titleControl.barColor);
        win.titleControl = nav.titleControl;
    } else nav.titleImage ? win.titleImage = nav.titleImage : nav.title && (win.title = nav.title);
    var leftNavButtons = nav.leftNavButtons;
    null != leftNavButtons && (1 == leftNavButtons.length ? win.leftNavButton = createNavButton(leftNavButtons[0]) : win.leftNavButtons = createNavButtons(leftNavButtons));
    var rightNavButtons = nav.rightNavButtons;
    rightNavButtons && (win.rightNavButton = 1 == rightNavButtons.length ? createNavButton(rightNavButtons[0]) : createNavButtons(rightNavButtons));
};