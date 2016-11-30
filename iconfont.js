var defaultFont;
var maps = {};

/*
// Ionicons
require('iconfont').init('ionicons', function(fontObj, maps, fontName) {
	var icons = fontObj.icons;
	for (var i = 0, ii = icons.length; i < ii; i++) {
		var properties = icons[i];
		maps[fontName][properties.name] = String.fromCharCode(parseInt(properties.code, 16));
	}
});
*/
exports.init = function(fontName, fontParser) {
	maps[fontName] = {};
	
	if (defaultFont == null) {
		defaultFont = fontName;
	}
	
	var fontFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + fontName + '.json');
	if (!fontFile.exists()) { 
		console.log('*** iconfont: Did you copy your font\'s [selection.json] file ' 
			+ 'into the [lib] folder of your application and name it [' + fontName + '.json] ?'); 
	}
	
	try {
		var fontObj = JSON.parse(fontFile.read().text);
		
		if (fontParser) {
			fontParser(fontObj, maps, fontName);
		} else {
			
			if (Array.isArray(fontObj)) {
				// https://materialdesignicons.com/
				// Map: copied from preview.html in download package
				// iconfont-ex-5.json
				if (fontObj[0].hex) {
					for (var i = 0, ii = fontObj.length; i < ii; i++) {
						var properties = fontObj[i];
						maps[fontName][properties.name] = String.fromCharCode(parseInt(properties.hex, 16));
					}
				} 
				// https://github.com/MattMcFarland/com.mattmcfarland.fontawesome/blob/master/lib/icons.js
				// iconfont-ex-1.json
				else {
					for (var i = 0, ii = fontObj.length; i < ii; i++) {
						var properties = fontObj[i];
						maps[fontName][properties[0]] = String.fromCharCode(properties[1]);
					}
				}
			} else {
				var fontMap = fontObj.icons;
				if (fontMap) {
					// IcoMoon style
					// iconfont-ex-2.json
					if (Array.isArray(fontMap)) {
						for (var i = 0, ii = fontMap.length; i < ii; i++) {
							var properties = fontMap[i].properties;
							maps[fontName][properties.name] = String.fromCharCode(properties.code);
						}
					} 
					// Google Material Icon
					// iconfont-ex-4.json
					// Font: https://github.com/google/material-design-icons/tree/master/iconfont
					// Map: https://github.com/google/material-design-icons/blob/master/iconfont/MaterialIcons-Regular.ijmap
					else {
						for (var key in fontMap) {
							maps[fontName][fontMap[key].name] = String.fromCharCode('0x' + key);
						}
					}
				} 
				// https://github.com/k0sukey/TiIconicFont/blob/master/Resources/lib/FontAwesome.js
				// iconfont-ex-3.json
				else {
					for (var key in fontObj) {
						maps[fontName][key] = String.fromCharCode(fontObj[key]);
					}
				}
			}
			
		}
	} catch (fontParseError) {
		console.log('*** iconfont: fontParseError: ' + fontParseError);
	}
};

/*
 require('iconfont').getText('collapse');
 * */
function getText(iconname, fontName) {
	if (defaultFont == null) {
		console.log('*** iconfont: Please call require("iconfont").init("fontName") before use it.');
	}
	
	if (typeof iconname == 'string') {
		var map = maps[fontName || defaultFont];
		return map ? map[iconname] : '';
	} else {
		return String.fromCharCode(iconname);
	}
};
exports.getText = getText;

function validateFont(view) {
  	if (view.font == null) {
		view.font = { fontFamily: defaultFont };
	} else if (view.font.fontFamily == null) {
		view.font.fontFamily = defaultFont;
	}
}

/*
 <Label module="iconfont" class="sport-icon" text="collapse"/>
 or
 require('iconfont').createLabel( $.createStyle({ classes: 'sport-icon', text: 'collapse' }) );
 * */
exports.createLabel = function(args) {
	var label = Ti.UI.createLabel(args);
	validateFont(label);
	label.text = getText(label.text, label.font.fontFamily);
	return label;
};

/*
 <Button module="iconfont" class="button-add" title="add"/>
 or
 require('iconfont').createButton( $.createStyle({ classes: 'button-add', title: 'add' }) );
 * */
exports.createButton = function(args) {
	var button = Ti.UI.createButton(args);
	validateFont(button);
	button.title = getText(button.title, button.font.fontFamily);
	return button;
};
