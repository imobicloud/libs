var defaultFont;
var maps = {};

exports.init = function(fontname) {
	maps[fontname] = {};
	
	if (defaultFont == null) {
		defaultFont = fontname;
	}
	
	try {
		var obj = JSON.parse(Titanium.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + 'fontmaps/' + fontname + '.json').read().text);
		var fontmap = obj.icons;
		for (var i = 0, ii = fontmap.length; i < ii; i++) {
			var iconName = fontmap[i].properties.name;
			var code = fontmap[i].properties.code;
			maps[fontname][iconName] = String.fromCharCode(code);
		}
	} catch (fontParseError) {
		console.log('*** iconfont: There was a font parsing error.  ' + 'Did you copy your font\'s selection.json file ' + 'into the assets/fontmaps folder of your application and name it ' + fontname + '.json?');
		console.log('*** iconfont: fontParseError: ' + fontParseError);
	}
};

function getText(iconname, fontname) {
	if (defaultFont == null) {
		console.log('*** iconfont: Please call require("iconfont").init("fontname") before use it.');
	}
	
	if (typeof iconname == 'string') {
		return maps[fontname || defaultFont][iconname];
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
