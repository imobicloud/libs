function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function openWin2() {
        Alloy.Globals.WinManager.load({
            url: "win_2",
            isReset: false
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "win_1";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.win_1 = Ti.UI.createWindow({
        backgroundColor: "#f5f5f5",
        barColor: "silver",
        title: "Win 1",
        id: "win_1"
    });
    $.__views.win_1 && $.addTopLevelView($.__views.win_1);
    $.__views.__alloyId0 = Ti.UI.createButton({
        title: "Open win 2",
        id: "__alloyId0"
    });
    $.__views.win_1.add($.__views.__alloyId0);
    openWin2 ? $.__views.__alloyId0.addEventListener("click", openWin2) : __defers["$.__views.__alloyId0!click!openWin2"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.init = function() {
        Ti.API.error("init " + JSON.stringify(1));
    };
    exports.cleanup = function() {
        Ti.API.error("cleanup " + JSON.stringify(1));
    };
    exports.reload = function(data) {
        Ti.API.error("reload " + JSON.stringify(1));
        data && Ti.API.error("reload data " + JSON.stringify(data));
    };
    exports.unload = function() {
        Ti.API.error("unload " + JSON.stringify(1));
    };
    __defers["$.__views.__alloyId0!click!openWin2"] && $.__views.__alloyId0.addEventListener("click", openWin2);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;