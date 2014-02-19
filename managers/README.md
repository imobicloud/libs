Managers
====

titanium libraries

ui.js and nav folder are used locally inside window.js, tabgroup.js, page.js and plugins.js. 

plugins.js contains useful plugins for window and tabgroup


## Window Manager

A library help you to manage windows

### Basic usage

	// init win manager
	var oWindowManager = require('managers/window'),
		winManager = new oWindowManager();

	// open a window
	winManager.load({
		url: 'path_to_window'
	});	

	// open a child window
	winManager.load({
		url: 'path_to_child_window',
		isReset: false
	});	

	// get data
	var infos = winManager.getCache();
	Ti.API.log(infos);
	/* [
		{ url: 'path_to_window', isReset: true },
		{ url: 'path_to_child_window', isReset: false }
	] */

	// back to parent window
	winManager.loadPrevious(data);	// new data for parent window

	// open a new window, remove other windows
	winManager.load({
		url: 'path_to_new_window',
		isReset: true,
		data: 123 				// data for this window
	});	

	// get current window info
	var info = winManager.getCache(-1);
	Ti.API.log(info); // { url: 'path_to_new_window', isReset: true, data: 123 }

	// exit the app
	winManager.exit();


### Advanced usage

	// init win manager
	var oWindowManager = require('managers/window'),
		winManager = new oWindowManager(windowCallback);	

	function windowCallback(status, params, win) {
		var oSwitch = {
			0: winBeforeLoad,
			1: winLoaded,
			2: winDestroy
		};
		return oSwitch[status](params, win);
	};

	function winBeforeLoad(params) {
		// before load a window, at this point, window is null
	}

	function winLoaded(params, win) {
		// window loaded, at this point, window is NOT null
	}

	function winDestroy(params, win) {
		// window will be closed after this 
	}	

### Plugins usage

	var plugins = require('managers/plugins'),
		oWindowManager = require('managers/window'),
		winManager = new oWindowManager( plugins.windowChanged );

## TabGroup Manager


## Page Manager