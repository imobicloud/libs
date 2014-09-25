// navigation
exports.nav = {
	title: 'This is Win 2',
	rightNavButton: [
		{
			title: 'Edit',
			icon: '/images/tabs/settings.png',
			showAsAction: OS_IOS ? null : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			callback: function() {
			  	alert('Edit clicked');
			}
		}
	]
};

exports.init = function() {
	// window will run when window is created
	setTimeout(function(){
		// hide AI
		Alloy.Globals.toggleAI(false);
		
		// update Navigation
		var nav = exports.nav;
		nav.title = 'Updated Title';
		Alloy.Globals.updateNav(nav, false);
	}, 3000);
};

exports.cleanup = function() {
	// this will run when open a child window
};

exports.reload = function() {
	// this will run when child window is close and this window focused
};

exports.unload = function() {
	// this will run when this window is closed
};

function openWin1(e) {
  	Alloy.Globals.WinManager.loadPrevious();
}