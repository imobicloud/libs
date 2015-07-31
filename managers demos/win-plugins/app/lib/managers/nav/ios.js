exports.load = function load(win, nav) {
  	if (nav.titleControl) {
  		if ( parseInt(Ti.Platform.version.split(".")[0], 10) > 6 ) {
  			nav.titleControl.borderColor = nav.titleControl.barColor; 
  		}
  		
		win.titleControl = nav.titleControl;
	} else if (nav.titleImage) {
		win.titleImage = nav.titleImage;
	} else if (nav.title) {
		win.title = nav.title;
	}
	
	var leftNavButtons = nav.leftNavButtons;
	if (leftNavButtons != null) {
		if (leftNavButtons.length == 1) {
			win.leftNavButton  = createNavButton(leftNavButtons[0]);
		} else {
			// win.leftNavButtons = createNavButtons(leftNavButtons);  //TODO: click event does not fire with leftNavButtons
			   win.leftNavButton  = createNavButtons(leftNavButtons);
		}
	}	
		
	var rightNavButtons = nav.rightNavButtons;
	if (rightNavButtons) {
		if (rightNavButtons.length == 1) {
			win.rightNavButton  = createNavButton(rightNavButtons[0]);
		} else {
			// win.rightNavButtons = createNavButtons(rightNavButtons); //TODO: click event does not fire with rightNavButtons
			   win.rightNavButton  = createNavButtons(rightNavButtons);
		}
	}
};

function createNavButtons(params) {
	//TODO: click event does not fire with rightNavButtons
	/*
	var navButtons = [];
  	for(var i = params.length - 1; i >= 0; i--){
	  	navButtons.push( createNavButton(params[i]) );
	};
	return navButtons;
	*/
	
	var view = Ti.UI.createView({ width: Ti.UI.SIZE, layout: 'horizontal' });
  	for(var i=0,ii=params.length; i<ii; i++){
  		var button = createNavButton(params[i]);
	  	view.add(button);
	};
	return view;
}

function createNavButton(params) {
	if (params.callback) {
		var button = Ti.UI.createButton({ backgroundImage: 'NONE' });
		if (params.icon) {
			button.image = params.icon;
		} 
		if (params.title) {
			button.title = params.title;
		}
		if (params.width) {
			button.width = params.width;
		};
		button.addEventListener('click', params.callback);
		return button;
	} else {
		return params;
	}
}