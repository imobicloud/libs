init();
function init() {
	// OS_ANDROID && (exports.nav = { title: 'Demo' });
	loadTabgroup();
};

exports.unload = function() {
	Alloy.Globals.Tabgroup.exit();
	Alloy.Globals.Tabgroup = null;
};

function loadTabgroup() {
  	// var oPlugins = require('managers/plugins'),
		// plugins  = new oPlugins({ ai: false, keyboard: false, toast: false });
	
	var TabGroupManager = require('managers/tabgroup'),
		Tabgroup = new TabGroupManager();
		
	// Tabgroup
		// .on('window:show', plugins.windowShow)
		// .on('window:hide', plugins.windowHide);
	
	Tabgroup.init({
		tabgroup: $.tabgroup,
		tabs: [
			{
				title: 'Win 1',
				url: 'win_1',
				activeIcon: '/images/home/1.png',
				icon: '/images/home/1.png',
				activeIconIsMask: true,
				iconIsMask: false,
				activeTitleColor: '#fff',
				titleColor: '#b1d9e7'
			},
			{
				title: 'Win 2',
				url: 'win_2',
				activeIcon: '/images/home/2.png',
				icon: '/images/home/2.png',
				activeIconIsMask: true,
				iconIsMask: false,
				activeTitleColor: '#fff',
				titleColor: '#b1d9e7'
			},
			{
				title: 'Win 3',
				url: 'win_3',
				activeIcon: '/images/home/3.png',
				icon: '/images/home/3.png',
				activeIconIsMask: true,
				iconIsMask: false,
				activeTitleColor: '#fff',
				titleColor: '#b1d9e7'
			}
		],
		defaultTab: 0
	});	
	
	Alloy.Globals.Tabgroup = Tabgroup;
}