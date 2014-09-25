function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "win_3";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    $.__views.win_3 = Ti.UI.createWindow({
        backgroundColor: "#f5f5f5",
        barColor: "silver",
        title: "Win 3",
        id: "win_3"
    });
    $.__views.win_3 && $.addTopLevelView($.__views.win_3);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    Ti.API.error("data " + JSON.stringify(args));
    exports.init = function() {
        Ti.API.error("init " + JSON.stringify(3));
    };
    exports.cleanup = function() {
        Ti.API.error("cleanup " + JSON.stringify(3));
    };
    exports.reload = function() {
        Ti.API.error("reload " + JSON.stringify(3));
    };
    exports.unload = function() {
        Ti.API.error("unload " + JSON.stringify(3));
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;