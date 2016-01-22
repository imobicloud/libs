var _ = require('alloy/underscore')._;

exports.Sports = [
	{ id: 'basketball', 	name: 'Basketball' },
	{ id: 'soccer', 		name: 'Soccer' },
	{ id: 'volleyball', 	name: 'Volleyball' },
	{ id: 'football', 		name: 'Football' },
	{ id: 'tennis', 		name: 'Tennis' },
	{ id: 'baseball', 		name: 'Baseball' },
	{ id: 'hockey', 		name: 'Hockey' },
	{ id: 'cricket', 		name: 'Cricket' },
	{ id: 'frisbee', 		name: 'Frisbee' },
	{ id: 'boxing', 		name: 'Boxing' },
	{ id: 'mma', 			name: 'MMA' },
	{ id: 'lacrosse', 		name: 'Lacrosse' },
	{ id: 'hiking', 		name: 'Hiking' }
];

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

exports.showTimePicker = function(container, params) {
	if (OS_IOS) {
		var timePicker = Alloy.createController('location/add/time_picker');
		timePicker.on('done', function(e) {
			params.callback(e);
			container.remove(timePicker.getView());
			container = timePicker = null;
		});
		container.add(timePicker.getView());
		timePicker.show(params);
	} else {
		Ti.UI.createPicker().showTimePickerDialog(_.extend({ 
			callback: function(e) {
	        	Ti.API.error('show time picker callback: ' + JSON.stringify( e ));
	        }, 
			okButtonTitle: 'Done',
			title: 'Select Time', 
			value: null, 
			format24: false 
		}, params));
	}
};

exports.showDatePicker = function(container, params) {
	if (OS_IOS) {
		var datePicker = Alloy.createController('location/invite/date_picker');
		datePicker.on('done', function(e) {
			params.callback(e);
			container.remove(datePicker.getView());
			container = datePicker = null;
		});
		container.add(datePicker.getView());
		datePicker.show(params);
	} else {
		Ti.UI.createPicker().showDatePickerDialog(_.extend({ 
			callback: function(e) {
	        	Ti.API.error('show date picker callback: ' + JSON.stringify( e ));
	        }, 
			okButtonTitle: 'Done',
			title: 'Select Date', 
			value: null, 
			format24: false 
		}, params));
	}
};

/*
exports.hideKeyboard = function(win) {
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
// */


