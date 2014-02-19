function Controller() {
    function init() {
        var plugins = require("managers/plugins");
        plugins.updateTabGroupNav({
            title: "Pinzly",
            controller: exports,
            tabgroup: $.tabgroup
        });
        var oTabGroupManager = require("managers/tabgroup"), tabGroup = new oTabGroupManager();
        Alloy.Globals.Tabgroup = tabGroup;
        tabGroup.init({
            tabgroup: $.tabgroup,
            tabs: [ {
                title: "Win 1",
                icon: "/images/tabs/icon.png",
                url: "win_1"
            }, {
                title: "Win 2",
                icon: "/images/tabs/icon.png",
                url: "win_2"
            }, {
                title: "Win 3",
                icon: "/images/tabs/icon.png",
                url: "win_3"
            } ],
            onChange: plugins.tabGroupChanged,
            onFocus: plugins.tabGroupFocussed
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "main_window";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.tabgroup = Ti.UI.createTabGroup({
        backgroundColor: "#f5f5f5",
        barColor: "silver",
        id: "tabgroup"
    });
    $.__views.tabgroup && $.addTopLevelView($.__views.tabgroup);
    exports.destroy = function() {};
    _.extend($, $.__views);
    init();
    exports.init = function() {};
    exports.cleanup = function() {
        var tabgroup = Alloy.Globals.Tabgroup, current = tabgroup.getCache(tabgroup.getActiveTab(), -1);
        current.controller.cleanup();
    };
    exports.reload = function() {
        var tabgroup = Alloy.Globals.Tabgroup, current = tabgroup.getCache(tabgroup.getActiveTab(), -1);
        current.controller.reload();
    };
    exports.unload = function() {
        Alloy.Globals.Tabgroup.exit();
        Alloy.Globals.Tabgroup = null;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;