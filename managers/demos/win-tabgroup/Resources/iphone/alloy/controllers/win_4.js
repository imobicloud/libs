function Controller() {
    function openMain() {
        Alloy.Globals.WinManager.load({
            url: "main_window"
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "win_4";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.win_4 = Ti.UI.createWindow({
        backgroundColor: "#f5f5f5",
        barColor: "silver",
        title: "Win 2",
        id: "win_4"
    });
    $.__views.win_4 && $.addTopLevelView($.__views.win_4);
    $.__views.__alloyId2 = Ti.UI.createButton({
        title: "Open Main window",
        id: "__alloyId2"
    });
    $.__views.win_4.add($.__views.__alloyId2);
    openMain ? $.__views.__alloyId2.addEventListener("click", openMain) : __defers["$.__views.__alloyId2!click!openMain"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.nav = {
        title: "Win 4"
    };
    exports.init = function() {
        Alloy.Globals.toggleAI(false);
    };
    exports.cleanup = function() {};
    exports.reload = function() {};
    exports.unload = function() {};
    __defers["$.__views.__alloyId2!click!openMain"] && $.__views.__alloyId2.addEventListener("click", openMain);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;