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


	componentWillReceiveProps () {
		this.setStateSafely({pageSource: null, currentPage: null, navigatableContext: null});
	},


	setPageSource (pageSource, currentPage, navigatableContext) {
		this.setStateSafely({pageSource, currentPage, navigatableContext});
	}
};
