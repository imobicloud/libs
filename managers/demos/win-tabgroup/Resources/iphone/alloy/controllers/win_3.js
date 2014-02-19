function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "win_3";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.win_3 = Ti.UI.createWindow({
        backgroundColor: "#f5f5f5",
        barColor: "silver",
        title: "Win 2",
        id: "win_3"
    });
    $.__views.win_3 && $.addTopLevelView($.__views.win_3);
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.init = function() {
        Alloy.Globals.toggleAI(false);
    };
    exports.cleanup = function() {};
    exports.reload = function() {
        Alloy.Globals.toggleAI(false);
    };
    exports.unload = function() {};
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;