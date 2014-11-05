'use strict';

module.exports = exports = {


	init: function(component) {
		global.addEventListener('orientationchange', this.changeHandler.bind(this, component));
		this.changeHandler(component);
	},


	changeHandler: function OnOrientationChange(component) {
		var state = 'portrait';
		var w = global;//window
		if(Math.abs(w.orientation) === 90 || w.innerWidth > w.innerHeight) {
			state ='landscape';
		}

		//console.debug('Window is now: %s', state);
		document.body.className = state;
		if (component) {
			component.setState({orientation: state});
		}
	}
};
