// TODO: support Google Material Icon
// https://github.com/google/material-design-icons/tree/master/iconfont
// maps: https://github.com/google/material-design-icons/blob/master/iconfont/MaterialIcons-Regular.ijmap

var defaultFont;
var maps = {};

exports.init = function(fontName) {
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
		
		// https://github.com/MattMcFarland/com.mattmcfarland.fontawesome/blob/master/lib/icons.js
		// iconfont-ex-1.json
		if (Array.isArray(fontObj)) {
			for (var i = 0, ii = fontObj.length; i < ii; i++) {
				var properties = fontObj[i];
				maps[fontName][properties[0]] = String.fromCharCode(properties[1]);
			}
		} else {
			var fontMap = fontObj.icons;
			// IcoMoon style
			// iconfont-ex-2.json
			if (fontMap) {
				for (var i = 0, ii = fontMap.length; i < ii; i++) {
					var properties = fontMap[i].properties;
					maps[fontName][properties.name] = String.fromCharCode(properties.code);
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
		return maps[fontName || defaultFont][iconname];
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
