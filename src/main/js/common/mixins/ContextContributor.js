import React from 'react';
import Accessor, {ContextParent, ContextResolver} from './ContextAccessor';

export {ContextParent, ContextResolver};

export default {
	mixins: [Accessor],

	childContextTypes: {
		[ContextResolver]: React.PropTypes.func,
		[ContextParent]: React.PropTypes.any
	},


	getChildContext () {
		return {
			[ContextResolver]: this.resolveContext,
			[ContextParent]: this
		};
	}
};
