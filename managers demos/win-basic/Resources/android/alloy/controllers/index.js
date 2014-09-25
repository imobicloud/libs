function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function init() {
        var oWindowManager = require("managers/window"), winManager = new oWindowManager();
        winManager.on("window:exit", confirmExit);
        Alloy.Globals.WinManager = winManager;
        winManager.load({
            url: "win_1"
        });
    }
    function confirmExit() {
        var dialog = Ti.UI.createAlertDialog({
            cancel: 0,
            buttonNames: [ "NO", "YES" ],
            message: "Are you sure?",
            title: "Quit?"
        });
        dialog.addEventListener("click", function(e) {
            e.index !== e.source.cancel && Alloy.Globals.WinManager.exit();
        });
        dialog.show();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    init();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;