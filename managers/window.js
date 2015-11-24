// var Alloy = require('alloy');

function WindowManager() {
	var UICache,
		events = {};
	
	init();
		
	// PRIVATE FUNCTIONS ========================================================
	
	function init() {
		var UIManager = require('managers/ui');
		UICache = new UIManager();
		UICache
			.on('ui:show', winLoaded)
			.on('ui:hide', winDestroy);
		
		//
		
		Ti.API.log('Window Manager: initialized');
	}

	function winLoaded(params, e) {
		fireEvent('window:show', params);
		
		var win = params.controller.getView();
		
		/*
		 NOTES:
		 
		 - To use managers with widget: nl.fokkezb.drawer / NappDrawer
		   
		   + hide nav bar
		   		if (OS_IOS) {
					$.drawer.window.navBarHidden = true;
				} else {
					$.drawer.window.title = 'Home';
				}
		   
		   + export a custom getView funtion
                exports.getView = function() {
                    return $.drawer.window;
                };
                
         - For widgets that return a window
                exports.getView = function() {
                    return $.widgetName.windowId;
                };
                
		 * */
		
		win.addEventListener('open', windowOpened);
		
		// cleanup cache, in case of window is closed not by Window Manager
		win.addEventListener('close', windowClosed);
		
		// make window visible
		if (params.controller.doShow == null) {
			if (OS_IOS && win.apiName != 'Ti.UI.TabGroup' && win.hasNavigationWindow != 'false') {
				if (params.isReset !== false) {
					createNavigationWindow(params, win);
				} else {
					var navigationWindow = getNavigationWindow();
					if (navigationWindow) {
						navigationWindow.openWindow(win, params.openAnimation);
					} else {
						createNavigationWindow(params, win);
					}
				}
			} else {
				win.open(params.openAnimation);
			}
		} else {
			params.controller.doShow(params, win);
		}
		
		// handle back event
		OS_ANDROID && win.addEventListener('androidback', androidback);
	}
	
	function winDestroy(params, e) {
		if (params._alreadyClosed !== true) {
			fireEvent('window:hide', params);
			
			var win = params.controller.getView();
			
			win.removeEventListener('close', windowClosed);
			
			if (params.controller.doHide == null) {
				if (OS_IOS && win.apiName != 'Ti.UI.TabGroup' && win.hasNavigationWindow != 'false') {
					if (params.navigationWindow) {
						params.navigationWindow.close(params.closeAnimation);
					} else {
						var navigationWindow = getNavigationWindow();
						navigationWindow.closeWindow(win, params.closeAnimation);
					}
				} else {
					// Caution: if win is TabGroup, make sure exitOnClose is false, or it will cause error on Android
					win.close(params.closeAnimation);
				}
			} else {
				params.controller.doHide(params, win);
			}
		}
		
		Ti.API.log('Window Manager: Cached window: ' + getCache().length);
	}
	
	function windowOpened(e) {
	  	var cache = getCache(-1),
	  		init  = cache.controller.init;
	  	init && init(cache);  
	}
	
	function windowClosed(e) {
	  	var cache = getCache(-1),
	  		iosback = cache.controller.iosback;
	  	cache._alreadyClosed = true;
	  	loadPrevious(OS_IOS && iosback ? iosback() : null);
	}
	
	function createNavigationWindow(params, win) {
	  	var navigationWindow = Ti.UI.iOS.createNavigationWindow({ window: win });
		params.navigationWindow = navigationWindow;
		navigationWindow.open(params.openAnimation);
	}
	
	function getNavigationWindow() {
	  	var cache = getCache(),
	  		navigationWindow;
	  	for(var i = cache.length - 1; i >= 0; i--){
			if (navigationWindow = cache[i].navigationWindow) {
				break;
			}
		};
		return navigationWindow;
	}
	
	/*
	 params ={
		url: '',			// the url of the window
		data: {},			// data for that window
		isReset : true,		// remove previous windows or not, default is true
		animated: true
	 }
	 * */
	function load(params) {
		Ti.API.log('Window Manager: Load window ' + params.url + ': ' + JSON.stringify(params.data));
		
		UICache.load(params);

		Ti.API.log('Window Manager: Cached window: ' + getCache().length);
	};
	
	function getCache(index) {
		return UICache.get(index);
	}

	function reset() {
	  	UICache.reset();
	  	Ti.API.log('Window Manager: Reset!');
	}

	/*
	 params:
	 - data: new data for current win
	 - count: number of previous wins will be removed
	 * */
	function loadPrevious(data, count, isReload) {
		return UICache.loadPrevious(data, count, isReload);
	}	
	function loadPreviousOrReset(data, count, isReload) {
		if ( count >= getCache().length ) {
			reset();
		} else {
			loadPrevious(data, count, isReload) || reset();	
		}
	}

	/*
	 exit app
	 * */
	function exit() {
		reset();

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
			fireEvent('window:exit');
		}
	}
	
	function on(type, callback) {
	  	if (events[type]) {
	  		events[type].push(callback);
	  	} else {
	  		events[type] = [callback];
	  	}
	  	return this;
	}
	
	function fireEvent(type, data) {
	  	var callbacks = events[type];
	  	if (callbacks) {
	  		for(var i=0,ii=callbacks.length; i<ii; i++){
				callbacks[i](data, { type: type });
			};
	  	}
	}
	
	// PUBLIC FUNCTIONS ========================================================
	
	return {
		on: on,
		load: load,
		loadPrevious: loadPrevious,
		loadPreviousOrReset: loadPreviousOrReset,
		getCache: getCache,
		reset: reset,
		exit: exit
	};
};

module.exports = WindowManager;