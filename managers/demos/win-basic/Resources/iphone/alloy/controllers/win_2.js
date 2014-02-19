function Controller() {
    function openWin1() {
        Alloy.Globals.WinManager.loadPrevious({
            from: "win_2"
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "win_2";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.win_2 = Ti.UI.createWindow({
        backgroundColor: "#f5f5f5",
        barColor: "silver",
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
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.init = function() {};
    exports.cleanup = function() {};
    exports.reload = function() {};
    exports.unload = function() {};
    __defers["$.__views.__alloyId1!click!openWin1"] && $.__views.__alloyId1.addEventListener("click", openWin1);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;