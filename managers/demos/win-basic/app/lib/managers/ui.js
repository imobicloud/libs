var Alloy = require('alloy');

/*
 onChange = function(status, params, UI) {
 	status: ui's status
 	 - 0: before
 	 - 1: ui created
 	 - 2: ui destroy
 	
 	UI: ui object, if status is 0, UI is null
 	
	params = {
		url: '',
		data: {},
		isReset: false,
		controller: exports // if status is 0, controller is null
	}

	controller may have the following functions
	 - init:    called when window loaded, after onChange(1) run
	 - cleanup: called when window loose focus
	 - reload:  called when window focus again
	 - unload:  called when window closed
	 - androidback: back event for android
 };
 * */
function UIManager(onChange) {
	var cache = [];
	
	(onChange == null) && (onChange = emptyFunction);
	
	// PRIVATE FUNCTIONS ========================================================
	
	function emptyFunction() {}
	
	/*
	 params:
	  - url: the url of the object
	  - data: data for that object
	  - isReset: remove previous object or not, default is true
	 * */
	function set(params) {
		if (onChange(0, params) === false) { return; }
		
		// cleanup previous
		cache.length && cache[cache.length - 1].controller.cleanup();
		
		// load new
		var controller = Alloy.createController(params.url, params.data);
		
		// apply default functions
		(controller.cleanup == null) && (controller.cleanup = emptyFunction);
		(controller.reload  == null) && (controller.reload  = emptyFunction);
		(controller.unload  == null) && (controller.unload  = emptyFunction);
		
		params.controller = controller;
		
		// remove previous
		(params.isReset !== false) && reset();
		
		// cached new
		cache.push(params);
		
		var view = controller.getView();
		
		onChange(1, params, view);
		
		controller.init && controller.init(params);  
		
		return view;
	};
	
	function destroyObject(params) {
		var controller = params.controller;
		
		controller.cleanup();
		controller.unload();
		
		onChange(2, params, controller.getView());
	}
	
	/*
	 params: 
	  - data: new data for current object
	  - count: number of previous object will be removed
	 * */
	function setPrevious(data, count) {
		var len = cache.length;
		
		if (len < 2) {
			return;
		}
		
		// if count == null or count == 0, set count = 1
		!count && (count = 1);
		
		var start = len - 1,
			end = len - count;
		
		if (end < 1) {
			end = 1;
		}
		
		// reload previous
		cache[end - 1].controller.reload(data);
		
		// destroy un-used object
		remove(start, end);
	};
	
	/*
	 return array if index is null
	 if index is negative: start is the last index - index
	 * */
	function get(index) {
		if (index == null) {
			return cache; 					// cache = [ { url: '', controller: object } ]
		} else if (index < 0) {
			index = cache.length + index;
		}
		
	  	return cache[index]; 				// cache = { url: '', controller: object }
	}
	
	/*
	 remove all object, except the objects after index [end]
	 if start is null: start is the last index
	 if start is negative: start is the last index - start
	 * */
	function remove(start, end) {
		if (start == null) {
			start = cache.length - 1;
		} else if (start < 0) {
			start = cache.length + start;
		}
		
		for (var i = start; i >= end; i--){
			destroyObject(cache[i]);
		  	cache.splice(i, 1);
		};
	}
	
	// remove all object
	// same as remove(-1, 0);
	function reset() {
		for (var i = cache.length - 1; i >= 0; i--){
		  	destroyObject(cache[i]);
		};
		cache.length = 0;
	}
	
	// PUBLIC FUNCTIONS ========================================================

	return {
        get: get,
        set: set,
        setPrevious: setPrevious,
        remove: remove,
        reset: reset
    };
};

module.exports = UIManager;