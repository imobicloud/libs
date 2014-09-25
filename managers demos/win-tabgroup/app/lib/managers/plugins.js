var Alloy = require('alloy');

function Plugins(type, config) {
	var _return = {},
		navigation;
	
	config = _.extend({
		ai: true,
		keyboard: true,
		navigation: false
	}, config);
	
	init();
	
	// PRIVATE FUNCTIONS ========================================================
	
	function init() {
		if (type == 'window') {
			_return.windowChanged = windowChanged;
		} else if (type == 'tabgroup') {
			_return.tabGroupChanged  = tabGroupChanged;
			_return.tabGroupFocussed = tabGroupFocussed;
		}
		
		config.ai 		&& (_return.toggleAI = toggleAI); 
		config.keyboard && (_return.hideKeyboard = hideKeyboard); 
		
		if (config.navigation) {
			if (OS_IOS) {
				navigation = require('managers/nav/ios'); // use NavigationWindow for iOS
			} else {
				if (Ti.Platform.Android.API_LEVEL >= 14) {
					navigation = require('managers/nav/android_new'); // use ActionBar for android 4.0 and up
				} else {
					navigation = require('managers/nav/android_old'); // custom nav for android below 4
				}
			}
		
			_return.updateNav = navigation.update;
		}
	}
	
	/* =============================================================================
	   start Window plugins
	   ========================================================================== */
	
	function windowChanged(status, params, win) {
		var oSwitch = {
			0: winBeforeLoad,
			1: winLoaded,
			2: winDestroy
		};
		return oSwitch[status](params, win);
	}
	
	function winBeforeLoad(params) {
		
	}
	
	function winLoaded(params, win) {
		if (config.navigation) {
			var controller = params.controller;
			if (controller.nav) {
				navigation.load(params, controller, win, 'window');
			}
		}
		
		if (win.apiName != 'Ti.UI.TabGroup') {
			config.ai 		&& loadAI(params, win);
			config.keyboard && loadKeyboard(params, win);
		}
	}
	
	function winDestroy(params, win) {
		if (config.ai && params.ai) {
			params.ai.unload();
	  		params.ai = null;
		}
		config.keyboard && (params.hiddenTextfield = null);
	}
	
	/* =============================================================================
	   end Window plugins
	   ========================================================================== */
	
	
	
	/* =============================================================================
	   start Tabgroup plugins
	   ========================================================================== */
	
	function tabGroupChanged(status, params, win) {
		if (status == 1) {
			var controller = params.controller;
			if (config.navigation && controller.nav) {
				if (OS_IOS || params._isRootWindow !== true) {
					navigation.load(params, controller, win, 'tabgroupWindow');
				}
			}
			
			config.ai 		&& loadAI(params, win);
			config.keyboard && loadKeyboard(params, win);
		}
	};
	
	function tabGroupFocussed(currentIndex, previousIndex, tabgroup) {
		previousIndex != -1 && toggleAI(true); //TODO: remove this condition
		
		// update action bar's buttons
		if (config.navigation && OS_ANDROID) {
			var tabgroupController = Alloy.Globals.WinManager.getCache(-1).controller,
				currentTab = Alloy.Globals.Tabgroup.getCache(currentIndex, -1).controller;
			tabgroupController.nav = currentTab.nav;
			tabgroup.activity.invalidateOptionsMenu();
		}
	};
	
	/* =============================================================================
	   end Tabgroup plugins
	   ========================================================================== */
	
	/* =============================================================================
   start Utilities
   ========================================================================== */
	  
	function loadAI(params, win) {
	  	var ai = Alloy.createController('elements/ai', { visible: params._isRootWindow !== true }); // root window of tab: ai not show on load
	  	params.ai = ai;
		win.add( ai.getView() );
	}
	
	function toggleAI(visible, message, timeout) {
		// show/hide the AI of current window only
		var current = Alloy.Globals.WinManager.getCache(-1);
		if (current == null || current.ai == null) {
			var tabgroup = Alloy.Globals.Tabgroup;
			current = tabgroup.getCache(tabgroup.getActiveTab(), -1);
		}

		if (visible) {
			current.ai.toggle(true, message, timeout);
		} else {
			current.ai.toggle(false);
		}
	};
	
	function loadKeyboard(params, win) {
	  	// attach hidden textfield for hiding keyboard
		
		var hiddenTextfield = Ti.UI.createTextField({ visible: false });
		params.hiddenTextfield = hiddenTextfield;
		win.add(hiddenTextfield);
		
		// hide keyboard on tap, for iOS only, Android should use back button
		
		OS_IOS && win.addEventListener('singletap', function() {
			if (Ti.App.keyboardVisible) {
				hideKeyboard();
			}
		});
	}
	  
	function hideKeyboard() {
	  	var current = Alloy.Globals.WinManager.getCache(-1),
			txt = current.hiddenTextfield;
	  	txt.focus();
	  	txt.blur();
	}
	
	/* =============================================================================
	   end Utilities
	   ========================================================================== */
	
	// PUBLIC FUNCTIONS ========================================================

	return _return;
};

module.exports = Plugins;