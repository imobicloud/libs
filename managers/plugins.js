var Alloy = require('alloy'),
	useNav = true,
	navigation;

if (useNav) {
	if (OS_IOS) {
		navigation = require('managers/nav/ios'); // use NavigationWindow for iOS
	} else {
		if (Ti.Platform.Android.API_LEVEL >= 14) {
			navigation = require('managers/nav/android_new'); // use ActionBar for android 4.0 and up
		} else {
			navigation = require('managers/nav/android_old'); // custom nav for android below 4
		}
	}

	exports.updateNav = navigation.update;
}

/* =============================================================================
   start Window plugins
   ========================================================================== */

exports.windowChanged = function(status, params, win) {
	var oSwitch = {
		0: winBeforeLoad,
		1: winLoaded,
		2: winDestroy
	};
	return oSwitch[status](params, win);
};

function winBeforeLoad(params) {
	// var current = Alloy.Globals.WinManager.getCache(-1);
  	
  	// first load, current is null
  	// if (current) {
  		// toggleAI(true);
  	// }
}

function winLoaded(params, win) {
	if (useNav) {
		var controller = params.controller;
		if (controller.nav) {
			navigation.load(params, controller, win, 'window');
		}
	}
	
	if (win.apiName != 'Ti.UI.TabGroup') {
		attachUtils(params, win);
	}
}

function winDestroy(params, win) {
	// var controller = params.controller;
	if (params.ai) {
		params.ai.unload();
  		params.ai = null;
  		
  		params.hiddenTextfield = null;
	}
}

/* =============================================================================
   end Window plugins
   ========================================================================== */



/* =============================================================================
   start Tabgroup plugins
   ========================================================================== */

exports.tabGroupChanged = function(status, params, win) {
	if (status == 0) {
		// var tabgroup = Alloy.Globals.Tabgroup;
		// if (tabgroup && tabgroup.getCache(tabgroup.getActiveTab()).length > 1) {
			// toggleAI(true);
		// }
	} else if (status == 1) {
		var controller = params.controller;
		if (useNav && controller.nav) {
			if (OS_IOS || params._isRootWindow !== true) {
				navigation.load(params, controller, win, 'tabgroupWindow');
			}
		}
		
		attachUtils(params, win);
	}
};

exports.tabGroupFocussed = function(currentIndex, previousIndex, tabgroup) {
	previousIndex != -1 && toggleAI(true); //TODO: remove this condition
	
	// update action bar's buttons
	if (useNav && OS_ANDROID) {
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
  
function attachUtils(params, win) {
  	// attach AI
	
  	var ai = Alloy.createController('elements/ai', { visible: params._isRootWindow !== true }); // root window of tab: ai not show on load
  	params.ai = ai;
	win.add( ai.getView() );
	
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
exports.hideKeyboard = hideKeyboard;

 function toggleAI(visible, message, timeout) {
	// show/hide the AI of current window only
	var current = Alloy.Globals.WinManager.getCache(-1);
	if (current == null || current.ai == null /*current.controller.getView().apiName == 'Ti.UI.TabGroup'*/ ) {
		var tabgroup = Alloy.Globals.Tabgroup;
		current = tabgroup.getCache(tabgroup.getActiveTab(), -1);
	}
		
	if (visible) {
		current.ai.toggle(true, message, timeout);
	} else {
		current.ai.toggle(false);
	}
};
exports.toggleAI = toggleAI;

/* =============================================================================
   end Utilities
   ========================================================================== */