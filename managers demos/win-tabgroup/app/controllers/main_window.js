init();
function init() {
	// OS_ANDROID && (exports.nav = { title: 'Demo' });
	loadTabgroup();
};

exports.unload = function() {
	Alloy.Globals.Tabgroup.exit();
	Alloy.Globals.Tabgroup = null;
};

function loadTabgroup() {
  	// var oPlugins = require('managers/plugins'),
		// plugins  = new oPlugins({ ai: false, keyboard: false, toast: false });
	
	var TabGroupManager = require('managers/tabgroup'),
		Tabgroup = new TabGroupManager();
		
	// Tabgroup
		// .on('window:show', plugins.windowShow)
		// .on('window:hide', plugins.windowHide);
	
	Tabgroup.init({
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
		defaultTab: 0
	});	
	
	Alloy.Globals.Tabgroup = Tabgroup;
}