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

icon size: ios: 44, android 32
* */

exports.load = function(params, controller, win, type) {
	win.navBarHidden = true;
		
	// https://github.com/ricardoalcocer/actionbarclone
	
	var headerbar = Alloy.createWidget('com.alco.headerbar');
	params.headerbar = headerbar;
	
	headerbar.setParentContainer(win);
	
	var nav = controller.nav;
	nav.backgroundImage && headerbar.setBackground({ image: nav.backgroundImage });
	nav.titleImage && headerbar.setAppIcon(nav.titleImage);
	nav.title && headerbar.setTitle({ text: nav.title, color: '#000' });
	
	if (params.isReset !== false) {
		// TODO: nav.homeAction?
	} else {
		headerbar.setBlackAngle();
		headerbar.showAngle();
		nav.backAction && headerbar.setBack(nav.backAction);
	}
	
	// buttons
	var array = ( nav.leftNavButton || [] ).concat( nav.rightNavButton || [] ),
		visible = [],
		inflater = [],
		androidmenu = [];
	
	array.forEach(function(button){
		if (button.showAsAction === Ti.Android.SHOW_AS_ACTION_ALWAYS) {
			visible.push(button);
		} else if (button.showAsAction === Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW) {
			inflater.push(button);
		} else {
			androidmenu.push(button);
		}
	});
	
	headerbar.setActionButtons({ 
		visible: visible.length ? visible : null,
		inflater: inflater.length ? inflater : null,
		androidmenu: androidmenu.length ? androidmenu : null,
	});
	
	if (win.children.length) {
		win.children[0].top = 50;
	}
	
	var headerbarView = headerbar.getView();
	headerbarView.top = 0;
	win.add(headerbarView);
};

exports.update = function(nav, isTabgroup) {
	//TODO
};