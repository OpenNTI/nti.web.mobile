'use strict';

module.exports = exports = {

	getStateFromParent: function(key, defaultValue) {
		var state = null, owner = this._owner;

		while(owner) {
			state = owner.state;
			if (state && state[key]) {
				return state[key];
			}
			owner = owner._owner;
		}
		return defaultValue;
	}

};
