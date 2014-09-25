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
			showAsAction: OS_IOS ? null : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			callback: editClicked
		}
	],
 	rightNavButtons: [
		{
			title: 'Settings',
			icon: '/images/tabs/settings.png',
			showAsAction: OS_IOS ? null : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
			callback: editClicked
		},
		
		// Android only: show searchView on ActionBar, searchView required a table/listview [ ex: tableview.search = searchView ]
		{
			title: 'Search',
			icon: Ti.Android.R.drawable.ic_menu_search,
			actionView: Ti.UI.Android.createSearchView({ hintText: "Table Search" }),
			showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
		}
	],
 	
 	backAction: function(){},
 	homeAction: function(){},	// Android only, action when click on logo
 	backgroundImage: 'url' 		// Android only, background for action bar
}

icon size: ios: 44, android 32
* */
exports.load = navigation.load;
exports.update = navigation.update;