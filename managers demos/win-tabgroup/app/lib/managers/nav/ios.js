var Alloy = require('alloy'),
	isIOS7 = ( OS_IOS && parseInt( Ti.Platform.version.split(".")[0], 10 ) >= 7 ) ? true : false;
	
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

icon size: ios: 44, android 32
* */

exports.load = function(params, controller, win, type) {
	load(params, win, controller.nav);
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
	}
	
	params.controller.nav = nav;
	load(params, win, nav);
};

function load(params, win, nav) {
  	if (nav.titleControl) {
		win.titleControl = nav.titleControl;
	} else if (nav.titleImage) {
		win.titleImage = nav.titleImage;
	} else if (nav.title) {
		win.title = nav.title;
	}
	
	var leftNavButton = nav.leftNavButton;
	if (leftNavButton != null) {
		if (leftNavButton) {
			if (leftNavButton.length == 1) {
				win.leftNavButton = createNavButton(leftNavButton[0]);
			} else {
				win.leftNavButton = createNavButtons(leftNavButton);
			}
		} else {
			win.leftNavButton = Ti.UI.createView();
		}
	} else if (params.isReset == false) {
		// use default Back button
		win.backButtonTitle = 'Back';
	}	
		
	var rightNavButton = nav.rightNavButton;
	if (rightNavButton) {
		if (rightNavButton.length == 1) {
			win.rightNavButton = createNavButton(rightNavButton[0]);
		} else {
			win.rightNavButton = createNavButtons(rightNavButton);
		}
	}
};

function createNavButtons(params) {
	var view = Ti.UI.createView({ width: Ti.UI.SIZE, layout: 'horizontal' });
  	for(var i=0,ii=params.length; i<ii; i++){
	  	view.add( createNavButton(params[i]) );
	};
	return view;
}

function createNavButton(params) {
	if (params.callback) {
		var button = Ti.UI.createButton({ /*title: params.title,*/ image: params.icon, backgroundImage: 'NONE' });
		button.addEventListener('click', params.callback);
		return button;
	} else {
		return params;
	}
}