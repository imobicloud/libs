Managers
====

titanium libraries

ui.js is used locally inside window.js, tabgroup.js, page.js and plugins.js. 

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
		winManager = new oWindowManager();	

	winManager.on('window:show', windowOpen);
	winManager.on('window:hide', windowClose);

	function windowOpen(params) {}

	function windowClose(params, win) {}	

### Plugins usage

Default plugins are: Activity Indicator, a hidden textfield for auto hide keyboard

UI element: AI is required.

	var oPlugins = require('managers/plugins'),
		plugins  = new oPlugins('window', { ai: true, keyboard: true }),
		oWindowManager = require('managers/window'),
		winManager = new oWindowManager( plugins.windowChanged );

NOTE: 
	if window has a webview, and keyboard is true, the webview is freezed. 
	https://jira.appcelerator.org/browse/TC-1056
	To fix this, set win.hasWebview to "true" and handle hide keyboard inside webview

	<Alloy>
		<Window class="win" hasWebview="true">
			<WebView id="container" url="/webview/html/index.html"/>
			<Require id="graph" src="elements/graph"/>
		</Window>
	</Alloy>


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

Default plugins are: Activity Indicator, a hidden textfield for auto hide keyboard

	var plugins = require('managers/plugins');
	tabGroup.init({
		tabgroup: $.tabgroup,
		tabs: [
			// ...
		],
		onChange: plugins.tabGroupChanged,
		onFocus:  plugins.tabGroupFocussed
	});

## Page Manager