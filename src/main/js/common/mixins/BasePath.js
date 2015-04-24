import React from 'react';

export default {

	contextTypes: {
		basePath: React.PropTypes.string.isRequired
	},

	getBasePath () {
		return this.context.basePath;
	}

};
