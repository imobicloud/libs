var nav;

exports.load = function(win, _nav) {
	nav = _nav;
	var activity = win.getActivity();
	if (activity) {
		activity.onCreateOptionsMenu = createMenuItems;
		if (activity.actionBar) {
			updateActionBar(activity.actionBar);
			if (nav.leftNavButtons || nav.rightNavButtons) {
				activity.invalidateOptionsMenu();
			}
		} 
	}
};

function createMenuItems(e) {
	var array = ( nav.leftNavButtons || [] ).concat( nav.rightNavButtons || [] );
	array.forEach(function(button) {
		if (button.showAsAction == null) { button.showAsAction = Ti.Android.SHOW_AS_ACTION_ALWAYS; }
		var menuItem = e.menu.add(button);
		button.callback && menuItem.addEventListener('click', button.callback);
		button.collapse && menuItem.addEventListener('collapse', button.collapse);
	});
}

function updateActionBar(actionBar) {
	if (nav.title != null) {
		actionBar.title = nav.title;
		actionBar.setDisplayShowTitleEnabled(true);
	}
	
	actionBar.subtitle = nav.subtitle || null;
	actionBar.icon = 'appicon.png';
	
	if (nav.titleImage) {
		actionBar.icon  = nav.titleImage;
		actionBar.setDisplayShowHomeEnabled(true);
	}
	
	nav.backgroundImage && (actionBar.backgroundImage = nav.backgroundImage);

	if (nav.homeAction) {
		actionBar.onHomeIconItemSelected = nav.homeAction;
	} else if (nav.backAction) {
		actionBar.displayHomeAsUp = true;
		actionBar.onHomeIconItemSelected = nav.backAction;
	}
}