var args = arguments[0] || {};
Ti.API.error('data ' + JSON.stringify( args ));

exports.init = function() {
	Ti.API.error('init ' + JSON.stringify( 3 ));
};

exports.cleanup = function() {
	Ti.API.error('cleanup ' + JSON.stringify( 3 ));
};

exports.reload = function() {
	Ti.API.error('reload ' + JSON.stringify( 3 ));
};

exports.unload = function() {
	Ti.API.error('unload ' + JSON.stringify( 3 ));
};