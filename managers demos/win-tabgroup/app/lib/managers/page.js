var Alloy = require('alloy');

function PageManager() {
	var UICache,
		container,
		events = {};
	
	// PRIVATE FUNCTIONS ========================================================
	
	/*
	args = {
		container: element,
	 	defaultPage: '',
	 	defaultPageData: null
	}	
	 * */
	function init(args) {
	  	container = args.container;
	  	
	  	var UIManager = require('managers/ui');
		UICache = new UIManager();
		UICache
			.on('ui:show', pageLoaded)
			.on('ui:hide', pageDestroy);
		
		args.defaultPage && load({
			url: args.defaultPage,
			data: args.defaultPageData
		});
	  	
	  	Ti.API.log('Page Manager: initialized');
	}
	
	function pageLoaded(params, view) {
		fireEvent('page:show', params);
		
		// make page visible
		var view = params.controller.getView();
		view.addEventListener('postlayout', pageVisible);
		container.add(view);
	}
	
	function pageDestroy(params, view) {
		fireEvent('page:hide', params);
		
		// hide page
		container.remove( params.controller.getView() );
	}
	
	function pageVisible(e) {
	  	e.source.removeEventListener('postlayout', pageVisible);
	  	var cache = getCache(-1),
	  		init  = cache.controller.init;
	  	init && init(cache);  
	}
	
	/*
	 params:
	  - url: the url of the page
	  - data: data for that page
	  - isReset: remove previous page or not, default is true
	 * */
	function load(params) {
		Ti.API.log('Page Manager: Load page ' + params.url + ': ' + JSON.stringify( params.data ));
		
		UICache.load(params);
	  	
		Ti.API.log('Page Manager: Cached page: ' + UICache.get().length);
	};
	
	/*
	 params: 
	  - count: number of revious pages will be removed
	  - data: new data for current page
	 * */
	function loadPrevious(data, count) {
	  	UICache.loadPrevious(data, count);
		
		Ti.API.log('Page Manager: Cached page: ' + UICache.get().length);
	};
	
	function getCache(index) {
	  	return UICache.get(index); 
	}
	
	function reset() {
		UICache.reset();
	  	Ti.API.log('Page Manager: Reset! Cached page: ' + UICache.get().length);
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
	
	function getView() {
	  	return container;
	}
	
	// PUBLIC FUNCTIONS ========================================================
	
	return {
		init: init,
		on: on,
		load: load,
		loadPrevious: loadPrevious,
		getCache: getCache,
		getView: getView,
		reset: reset
	};
}
module.exports = PageManager;