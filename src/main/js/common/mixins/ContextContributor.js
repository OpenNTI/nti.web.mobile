import React from 'react';
import Accessor from './ContextAccessor';

export default {
	mixins: [Accessor],

	childContextTypes: {
		contextResolver: React.PropTypes.func,
		contextParent: React.PropTypes.any
	},


	getChildContext () {
		return {
			contextResolver: this.resolveContext,
			contextParent: this
		};
	}
};
