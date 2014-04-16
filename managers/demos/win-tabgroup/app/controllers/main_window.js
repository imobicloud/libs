init();

exports.init = function() {
	
};

exports.cleanup = function() {
	// cleanup current tab
	var tabgroup = Alloy.Globals.Tabgroup,
		current = tabgroup.getCache(tabgroup.getActiveTab(), -1);
	current.controller.cleanup();	
};

exports.reload = function() {
	// reload current tab
	var tabgroup = Alloy.Globals.Tabgroup,
		current = tabgroup.getCache(tabgroup.getActiveTab(), -1);
	current.controller.reload();	
};

exports.unload = function() {
	Alloy.Globals.Tabgroup.exit();
	Alloy.Globals.Tabgroup = null;
};

function init() {
	var plugins = require('managers/plugins');
	
  	// initialize tabgroup manager
	
	var oTabGroupManager = require('managers/tabgroup'),
		tabGroup = new oTabGroupManager({
			tabgroup: $.tabgroup,
			tabs: [
				{
					title: 'Win 1',
					icon: '/images/tabs/icon.png',
					url: 'win_1'
				},
				{
					title: 'Win 2',
					icon: '/images/tabs/icon.png',
					url: 'win_2'
				},
				{
					title: 'Win 3',
					icon: '/images/tabs/icon.png',
					url: 'win_3'
				}
			],
			onChange: plugins.tabGroupChanged,
			onFocus:  plugins.tabGroupFocussed
		});
	
	Alloy.Globals.Tabgroup = tabGroup;

	exports.nav = {
		title: 'XCard'
	};

	plugins.updateTabGroupNav({
		controller: exports, 
		tabgroup: $.tabgroup
	});
}