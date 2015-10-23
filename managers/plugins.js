var Alloy = require('alloy');

// hasAI: true, hasWebview

function Plugins(config) {
	var _return = {
		windowShow: windowShow,
		windowHide: windowHide
	};
	
	config = _.extend({
		ai: true,
		keyboard: true, // if win.hasWebview == "true", this will be ignore, https://jira.appcelerator.org/browse/TC-1056
		toast: false
	}, config);
	
	init();
	
	// PRIVATE FUNCTIONS ========================================================
	
	function init() {
		config.ai 		&& (_return.toggleAI = toggleAI); 
		config.keyboard && (_return.hideKeyboard = hideKeyboard); 
		config.toast    && (_return.showToast = showToast);
	}
	
	function windowShow(params, e) {
		var win = params.controller.getView();
		config.ai 		&& loadAI(params, win);
		config.keyboard && loadKeyboard(params, win);
		config.toast    && loadToast(params, win);
	}
	
	function windowHide(params, e) {
		if (config.ai && params._ai) {
			params._ai.unload();
	  		params._ai = null;
		}
		config.keyboard && !OS_ANDROID && (params._txt = null);
	}
	
	/* =============================================================================
   start Utilities
   ========================================================================== */
	  
	function loadAI(params, win) {
		var ai = Alloy.createWidget('com.imobicloud.ai', { visible: win.hasAI + '' != 'false' });
	  	params._ai = ai;
	  	win.add( ai.getView() );
	}
	
	function toggleAI(visible, message, timeout) {
		if (visible) {
			var current = Alloy.Globals.WinManager.getCache(-1);
		  	if (current == null) {
				current = Alloy.Globals.Tabgroup.getCache(-1, -1);
		  	}
			
			if (current && current._ai) {
				current._ai.toggle(true, message, timeout);
			}
		} else {
			var cache = Alloy.Globals.WinManager.getCache();
		  	if (cache.length === 0) {
				cache = Alloy.Globals.Tabgroup.getCache(-1);
		  	}
		  	
		  	for(var i=0,ii=cache.length; i<ii; i++){
			  	var current = cache[i];
			  	if (current && current._ai) {
					current._ai.toggle(false);
				}
			};
		}
	};
	
	//
	
	function loadKeyboard(params, win) {
	  	// attach hidden textfield for hiding keyboard
	  	
		if (!OS_ANDROID) {
			var txt = Ti.UI.createTextField({ visible: false });
			params._txt = txt;
			win.add(txt);
		}
		
		// hide keyboard on tap
		
		if (win.hasWebview + '' != 'true') {
			// click: window is click-able, list-view is not click-able
			// singletap: window is not click-able, list-view is click-able
			win.addEventListener('click', function(e) {
				if ( ['Ti.UI.TextField', 'Ti.UI.TextArea', 'Ti.UI.SearchBar', 'Ti.UI.Android.SearchView'].indexOf( e.source.apiName ) == -1 ) {
					hideKeyboard();
				}
			});
		}
	}
	  
	function hideKeyboard() {
		if (OS_ANDROID) {
			Ti.UI.Android.hideSoftKeyboard();
		} else if (Ti.App.keyboardVisible) {
			var current = Alloy.Globals.WinManager.getCache(-1);
		  	if (current == null) {
				current = Alloy.Globals.Tabgroup.getCache(-1, -1);
		  	}
			
			if (current && current._txt) {
				var txt = current._txt;
			  	txt.focus();
			  	txt.blur();
			}
		}
	}
	
	//
	
	function loadToast(params, win) {
	  	var toast = Alloy.createWidget('com.imobicloud.toast', { hasNavBar: !win.navBarHidden + '' });
	  	params._toast = toast;
	  	win.add( toast.getView() );
	}
	
	function showToast(args) {
	    var current = Alloy.Globals.WinManager.getCache(-1);
	  	if (current == null) {
			current = Alloy.Globals.Tabgroup.getCache(-1, -1);
	  	}
		
		if (current && current._toast) {
			current._toast.show(args);
		} else {
			if (!args.buttonNames) { args.buttonNames = ['OK']; }
		    Ti.UI.createAlertDialog(args).show();
		}
	}
	
	/* =============================================================================
	   end Utilities
	   ========================================================================== */
	
	// PUBLIC FUNCTIONS ========================================================

	return _return;
};

module.exports = Plugins;