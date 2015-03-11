import React from 'react';
import SetStateSafely from './SetStateSafely';

const SetContext = 'context:set';
const SetPageSource = 'context:set:pagesource';

export default {
	mixins: [SetStateSafely],

	childContextTypes: {
		navigationContext: React.PropTypes.func,
		hasPages: React.PropTypes.func
	},

	getChildContext () {
		return {
			navigationContext: this[SetContext],
			hasPages: this[SetPageSource]
		};
	},


	componentWillReceiveProps () {
		this.setStateSafely({pageSource: null, currentPage: null, navigatableContext: null});
	},


	[SetContext] (navigatableContext) {
		this.setStateSafely({navigatableContext});
	},


	[SetPageSource] (pageSource, currentPage, navigatableContext) {
		this.setStateSafely({pageSource, currentPage, navigatableContext});
	}
};
