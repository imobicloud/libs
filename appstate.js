var cancelAndroidPauseEvent = false,
	cancelAndroidResumeEvent = false,
	pauseCallback,
	resumeCallback,
	manager;

exports.pause = function(callback, winManager) {
	if (OS_IOS) {
		Ti.App.addEventListener('pause', callback);
	} else if (OS_ANDROID) {
		//TODO: test pause for Android
		if (winManager == null) { return; }
		pauseCallback = callback;
		manager = winManager;
		winManager
            .on('window:show', function(params, e) {
            	var win = params.controller.getView();
    			win.addEventListener('open', function(e) {
					cancelAndroidResumeEvent = manager.getCache().length > 1 ? true : false;
    				
    				var activity = e.source.activity;
    				activity && activity.addEventListener('pause', function(e) {
    					if (cancelAndroidPauseEvent) {
					        cancelAndroidPauseEvent = false;
					    } else {
					        pauseCallback(e);
					    }
    				});
    			});
            })
            .on('window:hide', function(params, e) {
            	cancelAndroidPauseEvent = true;
            });
	}
};

exports.resume = function(callback, winManager) {
	if (OS_IOS) {
		Ti.App.addEventListener('resumed', callback);
	} else if (OS_ANDROID) {
		if (winManager == null) { return; }
		resumeCallback = callback;
		manager = winManager;
		winManager
            .on('window:show', function(params, e) {
            	var win = params.controller.getView();
    			win.addEventListener('open', function(e) {
    				cancelAndroidResumeEvent = manager.getCache().length > 1 ? true : false;
    				
    				var activity = e.source.activity;
    				activity && activity.addEventListener('resume', function(e) {
    					if (cancelAndroidResumeEvent) {
					        cancelAndroidResumeEvent = false;
					    } else {
					        resumeCallback(e);
					    }
    				});
    			});
            })
            .on('window:hide', function(params, e) {
            	cancelAndroidResumeEvent = true;
            });
	}
};

// Android only: when you don't want pause event fired when
// - start an activity
// - start a second win manager
exports.cancelPause = function() {
	cancelAndroidPauseEvent = true;
};

// Android only: when you don't want resume event fired when
// - exit an activity
// - exit a second win manager
exports.cancelResume = function() {
	cancelAndroidResumeEvent = true;
};