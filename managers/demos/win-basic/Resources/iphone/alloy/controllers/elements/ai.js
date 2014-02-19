function Controller() {
    function showAI(message) {
        message && ($.loadingMessage.text = message);
        $.loadingSpinner.show();
        $.ai.visible = true;
    }
    function hideAI() {
        $.loadingSpinner.hide();
        $.ai.visible = false;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "elements/ai";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.ai = Ti.UI.createView({
        zIndex: 100,
        backgroundColor: "#80000000",
        visible: false,
        id: "ai"
    });
    $.__views.ai && $.addTopLevelView($.__views.ai);
    $.__views.__alloyId2 = Ti.UI.createView({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        borderRadius: Alloy.CFG.size_10,
        backgroundColor: "#E6000000",
        layout: "vertical",
        id: "__alloyId2"
    });
    $.__views.ai.add($.__views.__alloyId2);
    $.__views.loadingSpinner = Ti.UI.createActivityIndicator({
        color: "#fff",
        top: Alloy.CFG.size_20,
        style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
        id: "loadingSpinner"
    });
    $.__views.__alloyId2.add($.__views.loadingSpinner);
    $.__views.loadingMessage = Ti.UI.createLabel({
        font: {
            fontSize: Alloy.CFG.size_14
        },
        color: "#fff",
        textAlign: "center",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        top: Alloy.CFG.size_10,
        right: Alloy.CFG.size_30,
        bottom: Alloy.CFG.size_20,
        left: Alloy.CFG.size_30,
        text: "Loading...",
        id: "loadingMessage"
    });
    $.__views.__alloyId2.add($.__views.loadingMessage);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var aiTimeout, args = arguments[0] || {};
    args.visible && showAI(args.message);
    exports.toggle = function(visible, message, timeout) {
        if (aiTimeout) {
            clearTimeout(aiTimeout);
            aiTimeout = null;
        }
        if (visible) {
            showAI(message);
            timeout && (aiTimeout = setTimeout(function() {
                var dialog = Ti.UI.createAlertDialog({
                    buttonNames: [ "OK" ],
                    message: "Activity timeout",
                    title: "Error"
                });
                dialog.show();
                dialog.addEventListener("click", hideAI);
            }, timeout));
        } else hideAI();
    };
    exports.unload = function() {
        if (aiTimeout) {
            clearTimeout(aiTimeout);
            aiTimeout = null;
        }
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;