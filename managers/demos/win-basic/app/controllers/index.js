init();

function init() {
	// initialize window manager
	
	var oWindowManager = require('managers/window'),
		winManager = new oWindowManager();
	
	Alloy.Globals.WinManager = winManager;
	
	// load UI
	
	winManager.load({
		url: 'win_1'
	});
}