import PropTypes from 'prop-types';
import React from 'react';
import Accessor, {ContextParent, ContextResolver} from './ContextAccessor';

export {ContextParent, ContextResolver};

export default {
	mixins: [Accessor],

	childContextTypes: {
		[ContextResolver]: PropTypes.func,
		[ContextParent]: PropTypes.any
	},


	getChildContext () {
		return {
			[ContextResolver]: this.resolveContext,
			[ContextParent]: this
		};
	}
};
