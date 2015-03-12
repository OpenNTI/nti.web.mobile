import React from 'react';
import Contributor from './ContextContributor';

export default {
	mixins: [Contributor],

	contextTypes: {
		navigationContext: React.PropTypes.func.isRequired,
		hasPages: React.PropTypes.func.isRequired
	},


	componentDidMount () {
		if (!this.getContext) {
			console.error('Missing getContext implementation');
		}

		let {navigationContext} = this.context;
		if (!navigationContext) {
			console.error('Expected a context method "navigationContext", but it does not exist.');
			return;
		}

		navigationContext(this);
	},


	setPageSource (pageSource, currentPage) {
		let {hasPages} = this.context;
		if (!hasPages) {
			console.error('Expected a context method "hasPages", but it does not exist.');
			return;
		}

		hasPages(pageSource, currentPage, this);
	}
};
