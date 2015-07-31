var Alloy = require('alloy');

function UIManager() {
	var cache = [],
		events = {};
	
	// PRIVATE FUNCTIONS ========================================================
	
	function emptyFunction() {}
	
	/*
	 params:
	  - url: the url of the object
	  - data: data for that object
	  - isReset: remove previous object or not, default is true
	 * */
	function load(params) {
		// cleanup previous
		if (cache.length) {
			var prev = cache[cache.length - 1];
			prev._alreadyCleanup = true;
			prev.controller.cleanup();
		}
		
		// load new
		var controller = Alloy.createController(params.url, params.data);
		delete params.data;
		
		// apply default functions
		(controller.cleanup == null) && (controller.cleanup = emptyFunction);
		(controller.reload  == null) && (controller.reload  = emptyFunction);
		(controller.unload  == null) && (controller.unload  = emptyFunction);
		
		params.controller = controller;
		
		// cached new
		cache.push(params);
		
		fireEvent('ui:show', params);
		
		// remove previous
		(params.isReset !== false) && remove(-2, 0);
	};
	
	function destroyObject(params) {
		var controller = params.controller;
		
		params._alreadyCleanup !== true && controller.cleanup(true);
		controller.unload();
		
		fireEvent('ui:hide', params);
	}
	
	/*
	 params: 
	  - data: new data for current object
	  - count: number of previous object will be removed
	 * */
	function loadPrevious(data, count, isReload) {
		var len = cache.length;
		
		if (len < 2) {
			return false;
		}
		
		// if count == null or count == 0, set count = 1
		!count && (count = 1);
		
		var start = len - 1,
			end = len - count;
		
		if (end < 1) {
			end = 1;
		}
		
		// cleanup current
		var current = cache[start];
		current._alreadyCleanup = true;
		current.controller.cleanup();
		
		// reload previous
		if (isReload !== false) {
			var prev = cache[end - 1];
			prev.controller.reload(data);
			prev._alreadyCleanup = false;
		}
		
		// destroy un-used object
		remove(start, end);
		
		return true;
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
		
		for (var i = end; i <= start; i++){
			destroyObject(cache[i]);
		};
		
		cache.splice(end, start - end + 1);
	}
	
	// remove all object
	// same as remove(-1, 0);
	function reset() {
		for (var i = 0, ii = cache.length; i < ii; i++){
		  	destroyObject(cache[i]);
		};
		cache.length = 0;
	}
	
	function on(type, callback) {
	  	if (events[type]) {
	  		events[type].push(callback);
	  	} else {
	  		events[type] = [callback];
	  	}
	  	return this;
	}
	
	function fireEvent(type, data) {
	  	var callbacks = events[type];
	  	if (callbacks) {
	  		for(var i=0,ii=callbacks.length; i<ii; i++){
				callbacks[i](data, { type: type });
			};
	  	}
	}
	
	// PUBLIC FUNCTIONS ========================================================

	return {
		on: on,
        get: get,
        load: load,
        loadPrevious: loadPrevious,
        reset: reset
    };
};

module.exports = UIManager;