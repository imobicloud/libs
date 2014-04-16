// var Alloy = require('alloy');

function TabGroupManager(args) {
	var UICaches = [], 
		tabgroup = args.tabgroup, 
		onFocus  = args.onFocus  || emptyFunction,
		onChange = args.onChange || emptyFunction,
		activeTab = args.defaultTab || 0,
		updateTabsAfterFocus = true;
	
	init(args.tabs);
	
	args = null;

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
	
		 defaultTab: 0,
	
		 onChange: function(status, params, win){
			 status =
			 - 0: start load
			 - 1: loading
			 - 2: load finish
			 - 3: ui remove
			 
			 // return false to stop default behavior
		 },
		 
		 onFocus: function(currentIndex, previousIndex, tabgroup){}
	 }
	 * */
	function init(arrayTab) {
		// render tabs

		var tabs = [], 
			oUIManager = require('managers/ui');

		for (var i = 0, ii = arrayTab.length; i < ii; i++) {
			var UIManager = new oUIManager(UIChange);
			UICaches.push(UIManager);

			// render tab button
			
			var tab = arrayTab[i];
			
			tabs.push(Ti.UI.createTab({
				icon: tab.icon,
				title: tab.title,
				window: UIManager.set({
					tabIndex: i,
					url: tab.url,
					data: tab.data,
					isRoot: true
				})
			}));
		};

		tabgroup.setTabs(tabs);
		tabgroup.addEventListener('focus', tabGroupFocus);
		
		(activeTab != 0) && tabgroup.setActiveTab(activeTab);
		
		//
		
		Ti.API.log('Tabgroup Manager: Initialize!');
	};
	
	function UIChange(status, params, win) {
	  	if (onChange(status, params, win) === false) { return false; }
	  	
	  	var oSwitch = {
			0: winBeforeLoad,
			1: winLoaded,
			2: winDestroy
		};
		return oSwitch[status](params, win);
	}
	
	function winBeforeLoad(params) {
		
	}
	
	function winLoaded(params, win) {
		
	}
	
	function winDestroy(params, win) {
		// do not remove root window of the tab
		if (params.isRoot) {
			return;
		}
		
		var controller = params.controller;
		
		if (OS_IOS) {
			if (params.isReset === false) {
				win.removeEventListener('close', windowClosed);
			}
			
			// remove window from tab
			if (params.isOpened !== false) {
				tabgroup.tabs[params.tabIndex].close(win);
			}
			
			params.isOpened = false;
		} else {
			win.close();
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

		if (params.tabIndex != activeTab) {
			updateTabsAfterFocus = false;
			
			// cleanup previous tab, for tab's child only
			var prev = getCache(activeTab, -1);
			prev.controller.cleanup();
			
			// focus tab
			tabgroup.setActiveTab(params.tabIndex);
			activeTab = params.tabIndex;
		}

		var win = UICaches[params.tabIndex].set(params);
		
		// make window visible, for tab's child only
		tabgroup.tabs[params.tabIndex].open(win);
		
		// handle events, for tab's child only
		if (OS_IOS) {
			if (params.isReset === false) {
				// cleanup cache, in case of window is closed by clicked on the default Back button or Tab button
				win.addEventListener('close', windowClosed);
			}
			
			params.isOpened = true;
		} else {
			win.addEventListener('androidback', androidback);
		}
		
		Ti.API.log('Tabgroup Manager: Tab ' + params.tabIndex + ' - Cached ' + getCache(params.tabIndex).length);
	}
	
	function windowClosed(e) {
	  	getCache(activeTab, -1).isOpened = false;
	  	loadPrevious();
	}

	/*
	 params:
	 - count: number of revious pages will be removed
	 - data: new data for current page, the reload function of current tab will be called
	 * */
	function loadPrevious(data, count) {
		UICaches[activeTab].setPrevious(data, count);
		
		Ti.API.log('Tabgroup Manager: Tab ' + activeTab + ' - Cached ' + getCache(activeTab).length);
	};

	function getCache(tabIndex, cacheIndex) {
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
		tabgroup = null;
		activeTab = null;
		UICaches.length = 0;

		Ti.API.log('Tabgroup Manager: Exit!');
	};
	
	function tabGroupFocus(e) {
		if (updateTabsAfterFocus === false) {
			updateTabsAfterFocus = true;
			return;
		}
		
		// this is required when tab has textfield, Android only
		if (OS_ANDROID && e.tab == null) { return; }
		
		var tabIndex = e.index,
			previousIndex = e.previousIndex;

		// first load
		if (previousIndex === -1) { return; }

		activeTab = tabIndex;
		
		// fire focus event
		onFocus(tabIndex, previousIndex, tabgroup);

		// cleanup previous tab
		if (previousIndex != tabIndex) {
			var prev = getCache(previousIndex, -1);
			prev.controller.cleanup();
		}
	
		// reload current tab
		var current = getCache(tabIndex, -1);
		current.controller.reload();
		
		Ti.API.log('Tabgroup Manager: Tab ' + tabIndex + ' focussed! ');
	}
	
	function androidback() {
		var controller = getCache(activeTab, -1).controller;
		if (controller.androidback && controller.androidback() === false) {
			return false;
		}
		
	  	if (getCache(activeTab).length > 1) {
	  		loadPrevious();
	  		return false;
	  	}
	}
	
	function emptyFunction() {}
	
	// PUBLIC FUNCTIONS ========================================================

	return {
		load: load,
		loadPrevious: loadPrevious,
		getCache: getCache,
		getActiveTab: getActiveTab,
		exit: exit
	};
}

module.exports = TabGroupManager;