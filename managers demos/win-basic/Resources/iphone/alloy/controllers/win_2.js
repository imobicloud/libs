function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function openWin1() {
        Alloy.Globals.WinManager.loadPrevious({
            from: "win_2"
        });
    }
    function openWin3() {
        Alloy.Globals.WinManager.load({
            url: "win_3",
            data: {
                title: "New Window"
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "win_2";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.win_2 = Ti.UI.createWindow({
        backgroundColor: "#f5f5f5",
        barColor: "silver",
        layout: "vertical",
        title: "Win 2",
        id: "win_2"
    });
    $.__views.win_2 && $.addTopLevelView($.__views.win_2);
    $.__views.__alloyId1 = Ti.UI.createButton({
        title: "Back to win 1",
        id: "__alloyId1"
    });
    $.__views.win_2.add($.__views.__alloyId1);
    openWin1 ? $.__views.__alloyId1.addEventListener("click", openWin1) : __defers["$.__views.__alloyId1!click!openWin1"] = true;
    $.__views.__alloyId2 = Ti.UI.createButton({
        title: "Open win 3",
        id: "__alloyId2"
    });
    $.__views.win_2.add($.__views.__alloyId2);
    openWin3 ? $.__views.__alloyId2.addEventListener("click", openWin3) : __defers["$.__views.__alloyId2!click!openWin3"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.init = function() {
        Ti.API.log("init " + JSON.stringify(2));
    };
    exports.cleanup = function() {
        Ti.API.log("cleanup " + JSON.stringify(2));
    };
    exports.reload = function() {
        Ti.API.log("reload " + JSON.stringify(2));
    };
    exports.unload = function() {
        Ti.API.log("unload " + JSON.stringify(2));
    };
    __defers["$.__views.__alloyId1!click!openWin1"] && $.__views.__alloyId1.addEventListener("click", openWin1);
    __defers["$.__views.__alloyId2!click!openWin3"] && $.__views.__alloyId2.addEventListener("click", openWin3);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;