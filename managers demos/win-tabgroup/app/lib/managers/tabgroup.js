// var Alloy = require('alloy');

function TabGroupManager() {
	var activeTab,
		events = {},
		// isFirstLoad = true,
		tabgroup,
		UICaches = [];
	
	// PRIVATE FUNCTIONS ========================================================

	/*
	 args = {
		 tabgroup: Ti.UI.TabGroup
		 tabs: [{
			 icon: '',
			 title: '',
		
			 url: '',
			 data: null
		 }],
		 defaultTab: 0
	 }
	 * */
	function init(args) {
		tabgroup = args.tabgroup;
		activeTab = args.defaultTab || 0;
		
		var arrayTab = args.tabs;
		
		// render tabs

		var tabs = [], 
			UIManager = require('managers/ui');

		for (var i = 0, ii = arrayTab.length; i < ii; i++) {
			var tab = arrayTab[i],
				UICache = new UIManager();
				
			UICache
				.on('ui:show', winLoaded)
				.on('ui:hide', winDestroy);
					
			UICache.load({
				tabIndex: i,
				url: tab.url,
				data: tab.data,
				_isRootWindow: true
			});	
			
			UICaches.push(UICache);

			// render tab button
			
			tabs.push(Ti.UI.createTab( _.extend(tab, { window: UICache.get(0).controller.getView() }) ));
		};

		tabgroup.setTabs(tabs);
		tabgroup.addEventListener('focus', tabGroupFocus);
		
		// handle back event
		OS_ANDROID && tabgroup.addEventListener('androidback', androidback);
		
		(activeTab != 0) && tabgroup.setActiveTab(activeTab);
		
		//
		
		Ti.API.log('Tabgroup Manager: Initialize!');
	};
	
	function winLoaded(params, e) {
		fireEvent('window:show', params);
	}
	
	function winDestroy(params, e) {
		fireEvent('window:hide', params);
		
		// do not remove root window of the tab
		if (params._isRootWindow) {
			return;
		}
		
		if (params._alreadyClosed !== true) {
			var win = params.controller.getView();
			win.removeEventListener('close', windowClosed);
			
			if (OS_IOS) {
				tabgroup.tabs[params.tabIndex].close(win);
			} else {
				win.close();
			}
		}
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
		Ti.API.log('Tabgroup Manager: load Tab ' + params.tabIndex + ' - Page ' + params.url + ': ' + JSON.stringify(params.data));

		var tabIndex = params.tabIndex;
		
		if (tabIndex == null) {
			tabIndex = activeTab;
		}
		
		// focus tab
		if (tabIndex != activeTab) {
			tabgroup.setActiveTab(tabIndex);
			activeTab = tabIndex;
		}

		if (params.url) {
			// tabgroup window does not allow remove root window
			params.isReset = false;
			
			UICaches[tabIndex].load(params);
			
			var win = params.controller.getView();
			
			win.addEventListener('open', windowOpened);
			
			// cleanup cache, in case of window is closed not by Tabgroup Manager
			win.addEventListener('close', windowClosed);
			
			// make window visible
			tabgroup.tabs[tabIndex].open(win);
			
			// if (OS_ANDROID) {
				// win.addEventListener('androidback', androidback);
			// }
		} else if (params.isReset !== false) {
			var len = getCache(activeTab).length;
			if (len > 1) {
				loadPrevious(params.data, len - 1);
			} else {
				getCache(activeTab, -1).controller.reload(params.data);
			}
		}
		
		Ti.API.log('Tabgroup Manager: Tab ' + tabIndex + ' - Cached ' + getCache(tabIndex).length);
	}
	
	function windowOpened(e) {
	  	var cache = getCache(activeTab, -1),
			init  = cache.controller.init;
		cache._alreadyInitialize = true;	
	  	init && init(cache);
	}
	
	function windowClosed(e) {
		var cache = getCache(activeTab, -1),
	  		iosback = cache.controller.iosback;
	  	cache._alreadyClosed = true;
	  	loadPrevious(OS_IOS && iosback ? iosback() : null);
	}

	/*
	 params:
	 - count: number of revious pages will be removed
	 - data: new data for current page, the reload function of current tab will be called
	 * */
	function loadPrevious(data, count, isReload) {
		UICaches[activeTab].loadPrevious(data, count, isReload);
		
		Ti.API.log('Tabgroup Manager: Tab ' + activeTab + ' - Cached ' + getCache(activeTab).length);
	};

	function getCache(tabIndex, cacheIndex) {
		(tabIndex === -1) && (tabIndex = activeTab);
		return UICaches[tabIndex].get(cacheIndex);
	};

	function getActiveTab() {
		return activeTab;
	};

	function exit() {
		// var tabs = tabgroup.tabs;
		for (var i = UICaches.length - 1; i >= 0; i--) {
			UICaches[i].reset();
			// tabgroup.removeTab(tabs[i]);
		};
		// tabs = null;
		
		activeTab = null;
		events = null;
		tabgroup = null;
		UICaches = null;
		
		// force exit app on Android
		if (OS_ANDROID) {
			var activity = Ti.Android.currentActivity;
			activity && activity.finish();
		}

		Ti.API.log('Tabgroup Manager: Exit!');
	};
	
	function tabGroupFocus(e) {
		if (OS_ANDROID && e.tab == null) { return; }                     // this is required when tab has text-field
		// if (OS_ANDROID && isFirstLoad) { isFirstLoad = false; return; }  // this event also fires when the activity enters the foreground
		
		var tabIndex = e.index,
			previousIndex = e.previousIndex;
		
		activeTab = tabIndex;
		
		if (previousIndex != -1) {
			// cleanup previous tab
			var prev = getCache(previousIndex, -1);
			prev.controller.cleanup();
		}
		
		var current = getCache(tabIndex, -1);
		if (current._alreadyInitialize) {
			// reload current tab
			current.controller.reload();
		} else {
			current._alreadyInitialize = true;
			var init = current.controller.init;
			init && init(current);
		}
		
		fireEvent('tabgroup:focus', { cache: current });
		
		Ti.API.log('Tabgroup Manager: Tab ' + tabIndex + ' focussed! ');
	}
	
	function androidback() {
		var controller = getCache(activeTab, -1).controller;
		if (controller.androidback && controller.androidback() === false) {
			return false;
		}
		
	  	if (getCache(activeTab).length > 1) {
	  		loadPrevious();
	  	} else {
	  		fireEvent('tabgroup:exit');
	  	}
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
	  	return tabgroup;
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
		exit: exit
	};
}

module.exports = TabGroupManager;