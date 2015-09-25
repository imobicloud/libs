init();

function init() {
	// initialize window manager
	
	var oPlugins = require('managers/plugins'),
		plugins  = new oPlugins('window', { ai: true, keyboard: false, toast: false });
	
	var oWindowManager = require('managers/window'),
		winManager = new oWindowManager();
		
	winManager
		.on('window:show', plugins.windowShow)
		.on('window:hide', plugins.windowHide);
	OS_ANDROID && winManager.on('window:exit', exitConfirm);	
	
	Alloy.Globals.WinManager = winManager;
	Alloy.Globals.toggleAI = plugins.toggleAI;
	
	// load UI
	
	winManager.load({
		url: 'win_1'
	});
}

function exitConfirm() {
    // var dialog = Ti.UI.createAlertDialog({
        // cancel : 0,
        // buttonNames : ['NO', 'YES'],
        // title : 'Quit?',
        // message: 'Are you sure?',
    // });
	// dialog.addEventListener('click', function(e) {
		// if (e.index !== e.source.cancel) {
			Alloy.Globals.WinManager.exit();
		// }
	// });
	// dialog.show();
}