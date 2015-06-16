// var Alloy = require('alloy');

function TabbarManager() {
	var activeTab,
		container,
		events = {},
		// isFirstLoad = true,
		UICaches = [];
	
	// PRIVATE FUNCTIONS ========================================================

	/*
	 args = {
		 container: Ti.UI.View
		 tabs: [{
			 url: '',
			 data: null
		 }],
		 defaultTab: 0
	 }
	 * */
	function init(args) {
		container = args.container;
		
		// render tabs

		var UIManager = require('managers/ui'),
			arrayTab = args.tabs;

		for (var i = 0, ii = arrayTab.length; i < ii; i++) {
			container.add( Ti.UI.createView({ visible: false }) );
			
			//
			
			var tab = arrayTab[i],
				UICache = new UIManager();
				
			UICache
				.on('ui:show', pageLoaded)
				.on('ui:hide', pageDestroy);
					
			UICache.load({
				tabIndex: i,
				url: tab.url,
				data: tab.data
			});	
			
			UICaches.push(UICache);
		};

		setActiveTab(args.defaultTab || 0, true, true);
		
		//
		
		Ti.API.log('Tabbar Manager: Initialize!');
	};
	
	function pageLoaded(params, e) {
		fireEvent('page:show', params);
		
		var vTab = container.children[params.tabIndex],
			length = vTab.children.length;
		length && (vTab.children[ length - 1 ].visible = false);
		vTab.add( params.controller.getView() );
	}
	
	function pageDestroy(params, e) {
		fireEvent('page:hide', params);
		
		var vTab = container.children[params.tabIndex],
			length = vTab.children.length;
		length > 1 && (vTab.children[ length - 2 ].visible = true);
		vTab.remove( params.controller.getView() );
	}
	
	/*
	 params = {
		url : url,				// the url of the page
		data : data,			// data for that page
		isReset : isReset,		// remove previous pages or not, default is true
		tabIndex : tabIndex		// tab index
	 }
	 * */
	function load(params) {
		Ti.API.log('Tabbar Manager: load Tab ' + params.tabIndex + ' - Page ' + params.url + ': ' + JSON.stringify(params.data));

		var tabIndex = params.tabIndex;
		
		// focus tab
		if (tabIndex != activeTab) {
			setActiveTab(tabIndex, false, false);
		}

		fireEvent('page:focus', { url: params.url });

		if (params.url) {
			// does not allow remove root window
			params.isReset = false;
			
			UICaches[tabIndex].load(params);
			
			params._alreadyInitialize = true;
			var init = params.controller.init;
		  	init && init(params);
		  	
		} else if (params.isReset !== false) {
			var len = getCache(activeTab).length;
			if (len > 1) {
				loadPrevious(params.data, len - 1);
			} else {
				var current = getCache(activeTab, -1);
				current.controller.reload(params.data);
				current.controller.getView().visible = true;
			}
		}
		
		Ti.API.log('Tabbar Manager: Tab ' + tabIndex + ' - Cached ' + getCache(tabIndex).length);
	}
	
	/*
	 params:
	 - count: number of revious pages will be removed
	 - data: new data for current page, the reload function of current tab will be called
	 * */
	function loadPrevious(data, count, isReload) {
		var cache = getCache(activeTab, -(count || 1) - 1);
		fireEvent('page:focus', { url: cache ? cache.url : '' });
		
		UICaches[activeTab].loadPrevious(data, count, isReload);
		
		Ti.API.log('Tabbar Manager: Tab ' + activeTab + ' - Cached ' + getCache(activeTab).length);
	};

	function getCache(tabIndex, cacheIndex) {
		(tabIndex === -1) && (tabIndex = activeTab);
		return UICaches[tabIndex].get(cacheIndex);
	};

	function getActiveTab() {
		return activeTab;
	};

	function setActiveTab(tabIndex, willReload, willShowUp) {
		// cleanup previous tab
		if (activeTab != null) {
			var prev = getCache(activeTab, -1);
			prev.controller.cleanup();
			prev.controller.getView().visible = false;
			container.children[activeTab].visible = false;
		}
		
		var current = getCache(tabIndex, -1);
		
		if (willShowUp !== false) {
			fireEvent('page:focus', { url: current.url });
		}
		
		activeTab = tabIndex;
		
		container.children[tabIndex].visible = true;
		
		if (willReload !== false) {
			// reload current tab
			if (current._alreadyInitialize) {
				current.controller.reload();
				current.controller.getView().visible = true;
			} 
			// or init
			else {
				current._alreadyInitialize = true;
				var init = current.controller.init;
				init && init(current);
			}
		} else if (willShowUp !== false) {
			current.controller.getView().visible = true;
		}
		
		Ti.API.log('Tabbar Manager: Tab ' + tabIndex + ' focussed! ');
	}
	
	function checkReady(callback) {
	  	if (container) {
	  		callback();
	  	}
	}
	
	function exit() {
		checkReady(function(){
			
			var children = container.children;
			for (var i = UICaches.length - 1; i >= 0; i--) {
				UICaches[i].reset();
				container.remove(children[i]);
			};
			
			activeTab = null;
			container = null;
			events = null;
			UICaches = null;
			
			Ti.API.log('Tabbar Manager: Exit!');
			
		});
	};
	
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
		getActiveTab: getActiveTab,
		setActiveTab: setActiveTab,
		exit: exit
	};
}

module.exports = TabbarManager;