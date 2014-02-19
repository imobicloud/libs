init();

function init() {
	var plugins = require('managers/plugins');
	Alloy.Globals.toggleAI = plugins.toggleAI;
	Alloy.Globals.updateNav = plugins.updateNav;
	
	// initialize window manager
	
	var oWindowManager = require('managers/window'),
		winManager = new oWindowManager(plugins.windowChanged);
	
	Alloy.Globals.WinManager = winManager;
	
	// load UI
	
	winManager.load({
		url: 'win_1'
	});
}