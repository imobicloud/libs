/*
exports.Photos = {
	showGallery: function(params) {
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
	},
	
	showCamera: function(params) {
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
	}
};
// */

/*
exports.Picker = {
	validateDate: function (params) {
	  	var value = params.value;
	  	if (value) {
	  		if (typeof value.toDate == 'function') {
	  			params.value = value.toDate();
	  		}
		} else {
			params.value = new Date();
		}
	},
	showTimePicker: function(params) {
		this.validateDate(params);
		if (OS_IOS) {
			var timePicker = Alloy.createController('ui/time_picker');
			timePicker.on('done', params.callback);
			timePicker.show(params);
		} else {
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
	},
	showDatePicker: function(params) {
		this.validateDate(params);
		if (OS_IOS) {
			var datePicker = Alloy.createController('ui/date_picker');
			datePicker.on('done', params.callback);
			datePicker.show(params);
		} else {
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
	}
};
// */

function hideKeyboard(container) {
	if (OS_ANDROID) {
		Ti.UI.Android.hideSoftKeyboard();
	} else if (Ti.App.keyboardVisible) {
		var textfield = container._txt;
		if (textfield == null) {
			textfield = Ti.UI.createTextField({ visible: false });
			container.add(textfield);
			container._txt = textfield;
		}
		textfield.focus();
		textfield.blur();
	}
}

exports.Keyboard = {
	hide: hideKeyboard,
	hideEvent: function(container, type) {
		/*
		 WARNING: Do not use this if window has webview inside
		 https://jira.appcelerator.org/browse/TIMOB-955
		 type can be:
		 	- click: window is click-able, list-view is not click-able
			- singletap: window is not click-able, list-view is click-able
		 * */
		container.addEventListener(type || 'click', function(e) {
			if ( ['Ti.UI.TextField', 'Ti.UI.TextArea', 'Ti.UI.SearchBar', 'Ti.UI.Android.SearchView'].indexOf( e.source.apiName ) == -1 ) {
				hideKeyboard(this);
			}
		});
	}
};


