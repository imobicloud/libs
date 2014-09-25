var navigation;

if (OS_IOS) {
	navigation = require('managers/nav/ios'); // use NavigationWindow for iOS
} else {
	navigation = require('managers/nav/android');
}

/*
var nav = controller.nav;
nav = {
 	title: '',
 	titleImage: 'url',
 	titleControl: Ti.UI.View,	// iOS only
 	
 	leftNavButtons: [
		{
			title: 'Edit',
			icon: '/images/tabs/edit.png',
			width: OS_IOS ? 100 : null, // iOS only
			showAsAction: OS_IOS ? null : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			callback: function(){}
		}
	],
 	rightNavButtons: [
		{
			title: 'Settings',
			icon: '/images/tabs/settings.png',
			width: OS_IOS ? 100 : null, // iOS only
			showAsAction: OS_IOS ? null : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
			callback: function(){}
		},
		
		// Android only: show searchView on ActionBar, searchView required a table/listview 
		// ex: 
		// var txtSearch = Ti.UI.Android.createSearchView({ hintText: 'Search message', iconifiedByDefault: false });
		// $.getView().add( Ti.UI.createTableView({ search: txtSearch, searchAsChild: false, visible: false }) );
		{
			title: 'Search',
			icon: Ti.Android.R.drawable.ic_menu_search,
			actionView: txtSearch,
			collapse: function(){},
			showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
		}
	],
 	
 	backAction: function(){},
 	homeAction: function(){},	// Android only, action when click on logo
 	backgroundImage: 'url' 		// Android only, background for action bar
}

icon size: 
	- ios:
		+ 2x: 44
		+ 1x: 22 
	- android 
		+ Full asset, 32x32 dp
		+ Optical square, 24x24 dp
* */
exports.load = navigation.load;
exports.update = navigation.update;