import React from 'react';
import Router from 'react-router-component';

export default {
	contextTypes: {
		router: React.PropTypes.any
	},


	getNavigable () {
		let {environment} = this.props;
		if (environment) {
			return environment;
		}

		return this.context.router || Router.environment.defaultEnvironment;
	},


	getPath () { return this.getNavigable().getPath(); }
};
