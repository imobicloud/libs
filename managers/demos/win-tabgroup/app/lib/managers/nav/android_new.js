var Alloy = require('alloy');
	
/*
var nav = controller.nav;
nav = {
 	title: '',
 	titleImage: 'url',
 	titleControl: Ti.UI.View,	// iOS only
 	
 	leftNavButton: Ti.UI.View, // iOS only
 	leftNavButton: [
		{
			title: 'Edit',
			icon: '/images/tabs/settings.png',
			showAsAction: OS_IOS ? null : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			callback: editClicked
		}
	],
 	rightNavButton: [
		{
			title: 'Edit',
			icon: '/images/tabs/settings.png',
			showAsAction: OS_IOS ? null : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			callback: editClicked
		}
	],
 	
 	backAction: function(){},
 	homeAction: function(){},	// Android only, action when click on logo
 	backgroundImage: 'url' 		// Android only, background for action bar
}
* */

exports.load = function(params, controller, win, type) {
	win.addEventListener('open', type != 'tabgroupWindow' ? windowOpened : tabgroupWindowOpened);
};

exports.update = function(nav, isTabgroup) {
	var params,
		win;
		
	if (isTabgroup !== true) {
		params = Alloy.Globals.WinManager.getCache(-1);
		win = params.controller.getView();
	} else {
		var tabgroup = Alloy.Globals.Tabgroup;
		
		params = tabgroup.getCache(tabgroup.getActiveTab(), -1);
		win = params.controller.getView();
		
		var activity = win.getActivity();
		if (activity) {
			if (activity.actionBar) {
				
			} else {
				params = Alloy.Globals.WinManager.getCache(-1);
				win = params.controller.getView();
			}
		}
	}
	
	params.controller.nav = nav;
	
	var activity = win.getActivity();
	if (activity) {
		if (activity.actionBar) {
			updateActionBar(activity.actionBar, params);
		}
		activity.invalidateOptionsMenu();
	}
};

function windowOpened(e) {
  	var activity = e.source.getActivity();
	if (activity) {
		activity.onCreateOptionsMenu = createMenuWindow;
		
		if (activity.actionBar) {
			updateActionBar(activity.actionBar, Alloy.Globals.WinManager.getCache(-1));
		}
	}
}

function tabgroupWindowOpened(e) {
  	var activity = e.source.getActivity();
	if (activity) {
		if (activity.actionBar) {
			activity.onCreateOptionsMenu = createMenuTabgroup;
			
			var tabgroup = Alloy.Globals.Tabgroup;
			updateActionBar(activity.actionBar, tabgroup.getCache(tabgroup.getActiveTab(), -1));
		}
	}
}

function createMenuWindow(e) {
	createMenuItems( e, Alloy.Globals.WinManager.getCache(-1) );
}

function createMenuTabgroup(e) {
	var tabgroup = Alloy.Globals.Tabgroup;
	createMenuItems( e, tabgroup.getCache(tabgroup.getActiveTab(), -1) );
}

function createMenuItems(e, params) {
	var nav = params.controller.nav;
  	if (nav) {
  		var array = ( nav.leftNavButton || [] ).concat( nav.rightNavButton || [] );
		array.forEach(function(button) {
			var menuItem = e.menu.add(button);
			menuItem.addEventListener('click', button.callback);
		});
	}
}

function updateActionBar(actionBar, params) {
	var nav = params.controller.nav;
	
	nav.title      		&& (actionBar.title = nav.title);
	nav.titleImage 		&& (actionBar.icon  = nav.titleImage);
	nav.backgroundImage && (actionBar.backgroundImage = nav.backgroundImage);

	if (params.isReset !== false) {
		nav.homeAction && (actionBar.onHomeIconItemSelected = nav.homeAction);
	} else {
		actionBar.displayHomeAsUp = true;
		actionBar.onHomeIconItemSelected = nav.backAction;
	}
}