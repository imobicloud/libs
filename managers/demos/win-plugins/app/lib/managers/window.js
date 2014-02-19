var Alloy = require('alloy');

/*
 onChange: function(status, params){
	 status =
	 - 0: start load
	 - 1: loading
	 - 2: load finish
	 - 3: window close
	 
	 return false to cancel default behavior
 }
 * */
function WindowManager(onChange) {
	var UIManager;
	
	(onChange == null) && (onChange = function() {});
	
	init();
		
	// PRIVATE FUNCTIONS ========================================================
	
	function init() {
		var oUIManager = require('managers/ui');
		UIManager = new oUIManager(UIChange);
		
		//
		
		Ti.API.log('Window Manager: initialized');
	}

	function UIChange(status, params, win) {
	  	if (onChange(status, params, win) === false) { return false; }
	  	
	  	var oSwitch = {
			0: winBeforeLoad,
			1: winLoaded,
			2: winDestroy
		};
		return oSwitch[status](params, win);
	}

	function winBeforeLoad(params) {}
	
	function winLoaded(params, win) {
		// make window visible
		if (OS_IOS && win.apiName != 'Ti.UI.TabGroup') {
			if (params.isReset !== false) {
				createNavigationWindow(params, win);
			} else {
				var navigationWindow = getNavigationWindow();
				if (navigationWindow) {
					// cleanup cache, in case of window is closed, by clicked on the default Back button
					params.isOpened = true;
					win.addEventListener('close', windowClosed);
					
					navigationWindow.openWindow(win);
				} else {
					createNavigationWindow(params, win);
				}
			}
		} else {
			win.open();
			
			// handle back event
			OS_ANDROID && win.addEventListener('androidback', androidback);
		}
	}
	
	function winDestroy(params, win) {
		// hide window
		if (OS_IOS && win.apiName != 'Ti.UI.TabGroup') {
			if (params.navigationWindow) {
				params.navigationWindow.close();
			} else {
				if (params.isOpened !== false) {
					params.isOpened = false;
					win.removeEventListener('close', windowClosed);
					
					var navigationWindow = getNavigationWindow();
					navigationWindow.closeWindow(win);
				}
			}
		} else {
			// Caution: if win is TabGroup, make sure exitOnClose is false, or it will cause error on Android
			win.close();
		}
		
		Ti.API.log('Window Manager: Cached window: ' + getCache().length);
	}
	
	function windowClosed(e) {
	  	getCache(-1).isOpened = false;
	  	loadPrevious();
	}
	
	function createNavigationWindow(params, win) {
	  	var navigationWindow = Ti.UI.iOS.createNavigationWindow({ window: win });
		params.navigationWindow = navigationWindow;
		navigationWindow.open();
	}
	
	function getNavigationWindow() {
	  	var cache = getCache(),
	  		navigationWindow;
	  	for(var i = cache.length - 1; i >= 0; i--){
			if (navWin = cache[i].navigationWindow) {
				break;
			}
		};
		return navigationWindow;
	}
	
	/*
	 params ={
		url: '',			// the url of the window
		data: {},			// data for that window
		isReset : true		// remove previous windows or not, default is true
	 }
	 * */
	function load(params) {
		Ti.API.log('Window Manager: Load window ' + params.url + ': ' + JSON.stringify(params.data));
		
		UIManager.set(params);

		Ti.API.log('Window Manager: Cached window: ' + getCache().length);
	};

	/*
	 params:
	 - data: new data for current win
	 - count: number of previous wins will be removed
	 * */
	function loadPrevious(data, count) {
		UIManager.setPrevious(data, count);
	};

	function getCache(index) {
		return UIManager.get(index);
	}

	/*
	 exit app
	 * */
	function exit() {
		UIManager.reset();

		// force exit app on Android
		if (OS_ANDROID) {
			var activity = Ti.Android.currentActivity;
			activity && activity.finish();
		}

		Ti.API.log('Window Manager: Exit!');
	}
	
	function androidback(e) {
		var controller = getCache(-1).controller;
		if (controller.androidback && controller.androidback() === false) {
			return;
		}
	
		if (getCache().length > 1) {
			loadPrevious();
		} else {
			var dialog = Ti.UI.createAlertDialog({
				cancel : 0,
				buttonNames : ['NO', 'YES'],
				message : 'Are you sure?',
				title : 'Quit?'
			});
			dialog.addEventListener('click', function(e) {
				if (e.index !== e.source.cancel) {
					exit();
				}
			});
			dialog.show();
		}
	}
	
	// PUBLIC FUNCTIONS ========================================================
	
	return {
		load: load,
		loadPrevious: loadPrevious,
		getCache: getCache,
		exit: exit
	};
};

module.exports = WindowManager;