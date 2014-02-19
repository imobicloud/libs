exports.init = function() {
	// window will run when window is created
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
  	Alloy.Globals.WinManager.loadPrevious({
  		from: 'win_2'
  	});
}