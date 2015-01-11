'use strict';

var React = require('react/addons');

Object.assign(exports, {

	contextTypes: {
		basePath: React.PropTypes.string.isRequired
	},

	getBasePath () {
		return this.context.basePath;
	}

});
