import React from 'react';
import SetStateSafely from './SetStateSafely';

export default {
	mixins: [SetStateSafely],

	childContextTypes: {
		hasPages: React.PropTypes.func
	},

	getChildContext () {
		return {
			hasPages: this.setPageSource
		};
	},


	setPageSource (pageSource) {
		this.setStateSafely({pageSource});
	}
};
