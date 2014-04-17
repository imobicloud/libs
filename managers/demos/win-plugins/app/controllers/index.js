init();

function init() {
	var oPlugins = require('managers/plugins'),
		plugins  = new oPlugins('window', { navigation: true });
		
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