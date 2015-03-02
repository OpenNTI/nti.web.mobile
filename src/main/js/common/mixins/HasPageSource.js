import React from 'react';

export default {

	contextTypes: {
		hasPages: React.PropTypes.func.isRequired
	},


	setPageSource (pageSource, currentPage) {
		let {hasPages} = this.context;
		if (!hasPages) {
			console.error('Expected a context method "hasPages", but it does not exist.');
			return;
		}

		hasPages(pageSource, currentPage);
	}
};
