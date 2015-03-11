import React from 'react';
import SetStateSafely from './SetStateSafely';

export default {
	mixins: [SetStateSafely],

	childContextTypes: {
		navigationContext: React.PropTypes.func
	},

	getChildContext () {
		return {
			navigationContext: this.setNavigationContext
		};
	},


	componentWillReceiveProps () {
		this.setStateSafely({pageSource: null, currentPage: null, navigatableContext: null});
	},


	setNavigationContext (pageSource, currentPage, navigatableContext) {
		this.setStateSafely({pageSource, currentPage, navigatableContext});
	}
};
