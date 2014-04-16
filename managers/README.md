Managers
====

titanium libraries

ui.js and nav folder are used locally inside window.js, tabgroup.js, page.js and plugins.js. 

plugins.js contains useful plugins for window and tabgroup


## Window Manager

A library help you to manage windows

### Basic usage

index.js

	// init win manager
	var oWindowManager = require('managers/window'),
		winManager = new oWindowManager();

	// open a window
	winManager.load({
		url: 'path_to_window'
	});	

	// open a child window
	winManager.load({
		url: 'path_to_child_window',
		isReset: false
	});	

	// get data
	var infos = winManager.getCache();
	Ti.API.log(infos);
	/* [
		{ url: 'path_to_window', isReset: true },
		{ url: 'path_to_child_window', isReset: false }
	] */

	// back to parent window
	winManager.loadPrevious(data);	// new data for parent window

	// open a new window, remove other windows
	winManager.load({
		url: 'path_to_new_window',
		isReset: true,
		data: 123 				// data for this window
	});	

	// get current window info
	var info = winManager.getCache(-1);
	Ti.API.log(info); // { url: 'path_to_new_window', isReset: true, data: 123 }

	// exit the app
	winManager.exit();


### Advanced usage

	// init win manager
	var oWindowManager = require('managers/window'),
		winManager = new oWindowManager(windowCallback);	

	function windowCallback(status, params, win) {
		var oSwitch = {
			0: winBeforeLoad,
			1: winLoaded,
			2: winDestroy
		};
		return oSwitch[status](params, win);
	};

	function winBeforeLoad(params) {
		// before load a window, at this point, window is null
	}

	function winLoaded(params, win) {
		// window loaded, at this point, window is NOT null
	}

	function winDestroy(params, win) {
		// window will be closed after this 
	}	

### Plugins usage

Default plugins are: Activity Indicator, a hidden textfield for auto hide keyboard, and Navigation

UI element: AI is required.

	var plugins = require('managers/plugins'),
		oWindowManager = require('managers/window'),
		winManager = new oWindowManager( plugins.windowChanged );

## TabGroup Manager

### Basic usage

xml

	<Alloy>
		<TabGroup id="tabgroup" class="win tabgroup"/>
	</Alloy>

js 

	// init tabgroup manager
	var oTabGroupManager = require('managers/tabgroup'),
		tabGroup = new oTabGroupManager({
			tabgroup: $.tabgroup,
			tabs: [
				{
					title: 'Tab 1',
					icon: '/images/tabs/icon-1.png',
					url: 'path_to_tab_1'
				},
				{
					title: 'Tab 2',
					icon: '/images/tabs/icon-2.png',
					url: 'path_to_tab_2'
				}
			]
		});

	// open a child window in Tab 2
	tabGroup.load({
		url: 'path_to_window',
		isReset: false,
		data: null,
		tabIndex: 1
	});

	// get active tab
	var activeIndex = tabGroup.getActiveTab(); // 1

	// get Tab 2 infos
	tabGroup.getCache(activeIndex); 

	// get info of current win of Tab 2 
	tabGroup.getCache(activeIndex, -1); // same with tabGroup.getCache(activeIndex, 1);

	// get info of previous win of Tab 2 
	tabGroup.getCache(activeIndex, 0); 

	// load previous window of Tab 2
	tabGroup.loadPrevious(new_data_for_win_path_to_tab_2);

	// exit tabgroup
	tabGroup.exit();

### Advanced usage

	tabGroup.init({
		tabgroup: $.tabgroup,
		tabs: [
			// ...
		],
		onChange: tabGroupChanged,
		onFocus:  tabGroupFocussed
	});

	function tabGroupChanged(status, params, win) {
		if (status == 0) {
			// before window create
		} else if (status == 1) {
			// window created
		} else {
			// window closed
		}
	};

	function tabGroupFocussed(currentIndex, previousIndex, tabgroup) {
		// tab focus changed
	};

### Plugins usage

Default plugins are: Activity Indicator, a hidden textfield for auto hide keyboard, and Navigation

	var plugins = require('managers/plugins');
	tabGroup.init({
		tabgroup: $.tabgroup,
		tabs: [
			// ...
		],
		onChange: plugins.tabGroupChanged,
		onFocus:  plugins.tabGroupFocussed
	});

	exports.nav = {
		title: 'XCard'
	};
	
	plugins.updateTabGroupNav({
		controller: exports, 
		tabGroup: $.tabgroup
	});

	// set exports.nav.leftNavButton to false to remove exists leftNavButton

## Page Manager