exports.init = function() {
	Ti.API.error('init ' + JSON.stringify( 2 ));
};

exports.cleanup = function() {
	Ti.API.error('cleanup ' + JSON.stringify( 2 ));
};

exports.reload = function() {
	Ti.API.error('reload ' + JSON.stringify( 2 ));
};

exports.unload = function() {
	Ti.API.error('unload ' + JSON.stringify( 2 ));
};

function openWin1(e) {
  	Alloy.Globals.WinManager.loadPrevious({
  		from: 'win_2'
  	});
}

function openWin3(e) {
  	Alloy.Globals.WinManager.load({
  		url: 'win_3',
  		data: { name: 'Window Name' }
  	});
}