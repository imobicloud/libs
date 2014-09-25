// // hide nav bar / action bar
// var win = $.getView();
// if (OS_IOS) {
	// win.navBarHidden = true;
// } else {
	// win.addEventListener('open', function(e) {
		// e.source.activity.actionBar.hide();
	// });
// }

exports.init = function() {
	Ti.API.error('init ' + JSON.stringify( 1 ));
};

exports.cleanup = function() {
	Ti.API.error('cleanup ' + JSON.stringify( 1 ));
};

exports.reload = function(data) {
	Ti.API.error('reload ' + JSON.stringify( 1 ));
	
	if (data) {
		Ti.API.error('reload data ' + JSON.stringify(data));
	}
};

exports.unload = function() {
	Ti.API.error('unload ' + JSON.stringify( 1 ));
};

function openWin2(e) {
  	Alloy.Globals.WinManager.load({
  		url: 'win_2',
  		isReset: false
  	});
}