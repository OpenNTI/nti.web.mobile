'use strict';

module.exports = exports = {


	init: function(component) {
		global.addEventListener('orientationchange', this.changeHandler.bind(this, component));
		this.changeHandler(component);
	},


	changeHandler: function OnOrientationChange(component) {
		// delay this handler because on android the innerWidth and innerHeight
		// properties may not be updated yet, and because on android the height
		// of the nav drawer doesn't update if we fire immediately.
		setTimeout(function() {
			this._handler(component);
		}.bind(this), 500);
	},

	_handler: function(component) {
		var state = 'portrait';
		var w = global; //window
		if(Math.abs(w.orientation) === 90 || w.innerWidth > w.innerHeight) {
			state ='landscape';
		}
		document.body.className = state;
		//console.debug('Window is now: %s', state);
		if (component && component.isMounted()) {
			component.setState({orientation: state});
		}
	}

};
