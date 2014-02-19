function Controller() {
    function openWin2() {
        Alloy.Globals.WinManager.load({
            url: "win_2",
            isReset: true
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "win_1";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
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
    exports.init = function() {};
    exports.cleanup = function() {};
    exports.reload = function(data) {
        data && Ti.API.log("Win 1 reload " + JSON.stringify(data));
    };
    exports.unload = function() {};
    __defers["$.__views.__alloyId0!click!openWin2"] && $.__views.__alloyId0.addEventListener("click", openWin2);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;