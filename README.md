libs
====

titanium libraries

## Managers

View managers/readme.md for details

## Size manager

Scale any screen resolution to base resolution (320x480)

alloy.js

	var sizeManager = require('size_manager');

	// pre calculate these numbers to base resolution
	sizeManager.init([
		-1, -2, -3, -9,
		1, 2, 3, 5, 6, 7, 8,
		10, 12, 13, 14, 15,
		20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
		100,
		320,
		480
	]);
	
	// cache for later use
	Alloy.Globals.SizeManager = sizeManager;

tss files

	"Label": { font: { fontSize: Alloy.CFG.size_20 } }	

	/* 
		for negative numbers, use Alloy.CFG.size__
		example -3 will be Alloy.CFG.size__3 
	*/
	".button": { width: Alloy.CFG.size_100, height: Alloy.CFG.size_20, top: Alloy.CFG.size__9 }

	/* this will cause break layout, because 200 has not calculated yet */
	".button-2": { width: Alloy.CFG.size_200 } 

js files

	// runtime calculate 
	var scaledSize = Alloy.Globals.SizeManager.convertSize( 1000 );