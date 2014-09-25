init();

function init() {
	// initialize window manager
	
	var oWindowManager = require('managers/window'),
		winManager = new oWindowManager();
		winManager.on('window:exit', confirmExit);
	
	Alloy.Globals.WinManager = winManager;
	
	// load UI
	
	winManager.load({
		url: 'win_1'
	});
}

function confirmExit() {
  	var dialog = Ti.UI.createAlertDialog({
		cancel : 0,
		buttonNames : ['NO', 'YES'],
		message : 'Are you sure?',
		title : 'Quit?'
	});
	dialog.addEventListener('click', function(e) {
		if (e.index !== e.source.cancel) {
			Alloy.Globals.WinManager.exit();
		}
	});
	dialog.show();
}