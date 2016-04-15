/*
exports.openPhotoGallery = function(params) {
	Titanium.Media.openPhotoGallery(_.extend({
		autoHide: true,
        mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ],
        success: function(e) {
        	Ti.API.error('open gallery success: ' + JSON.stringify( e ));
        },
        cancel: function(e) {
        	Ti.API.error('open gallery cancel: ' + JSON.stringify( e ));
        },
        error: function(e) {
            Ti.API.error('open gallery error: ' + JSON.stringify( e ));
        }
	}, params));
};
// */

/*
exports.showCamera = function(params) {
	Titanium.Media.showCamera(_.extend({
		saveToPhotoGallery: true,
		success: function(e) {
        	Ti.API.error('show camera success: ' + JSON.stringify( e ));
        },
        cancel: function(e) {
        	Ti.API.error('show camera cancel: ' + JSON.stringify( e ));
        },
        error: function(e) {
            Ti.API.error('show camera error: ' + JSON.stringify( e ));
        }
	}, params));
};
// */

/*
function validateDate(params) {
  	var value = params.value;
  	if (value) {
  		if (typeof value.toDate == 'function') {
  			params.value = value.toDate();
  		}
	} else {
		params.value = new Date();
	}
}
// */

/*
exports.showTimePicker = function(container, params) {
	if (OS_IOS) {
		var timePicker = Alloy.createController('ui/time_picker');
		timePicker.on('done', function(e) {
			params.callback(e);
			container.remove(timePicker.getView());
			container = timePicker = null;
		});
		container.add(timePicker.getView());
		timePicker.show(params);
	} else {
		validateDate(params);
		
		Ti.UI.createPicker().showTimePickerDialog(_.extend({ 
			callback: function(e) {
				if (e.cancel) { return; }
	        	Ti.API.error('show time picker callback: ' + JSON.stringify( e.value ));
	        }, 
			okButtonTitle: 'Done',
			title: 'Select Time', 
			value: null, 
			format24: false 
		}, params));
	}
};
// */

/*
exports.showDatePicker = function(container, params) {
	if (OS_IOS) {
		var datePicker = Alloy.createController('ui/date_picker');
		datePicker.on('done', function(e) {
			params.callback(e);
			container.remove(datePicker.getView());
			container = datePicker = null;
		});
		container.add(datePicker.getView());
		datePicker.show(params);
	} else {
		validateDate(params);
		
		Ti.UI.createPicker().showDatePickerDialog(_.extend({ 
			callback: function(e) {
				if (e.cancel) { return; }
	        	Ti.API.error('show date picker callback: ' + JSON.stringify( e.value ));
	        }, 
			okButtonTitle: 'Done',
			title: 'Select Date', 
			value: null, 
			format24: false 
		}, params));
	}
};
// */

function hideKeyboard(win) {
	if (OS_ANDROID) {
		Ti.UI.Android.hideSoftKeyboard();
	} else if (Ti.App.keyboardVisible) {
		if (win._txt == null) {
			win._txt = Ti.UI.createTextField({ visible: false });
			win.add(win._txt);
		}
		win._txt.focus();
		win._txt.blur();
	}
};
exports.hideKeyboard = hideKeyboard;

exports.hideKeyboardEvent = function(win, e) {
	/*
	 WARNING: Do not use this if window has webview inside
	 https://jira.appcelerator.org/browse/TIMOB-955
	 
	 e can be:
	 	- click: window is click-able, list-view is not click-able
		- singletap: window is not click-able, list-view is click-able
	 * */
	
	win.addEventListener(e || 'click', function(e) {
		if ( ['Ti.UI.TextField', 'Ti.UI.TextArea', 'Ti.UI.SearchBar', 'Ti.UI.Android.SearchView'].indexOf( e.source.apiName ) == -1 ) {
			hideKeyboard(this);
		}
	});
};

