import React from 'react';

const GetContext = 'context:provider:get-local';

export const ContextParent = 'context:provider:parent';
export const ContextResolver = 'context:provider:resolver';

export default {

	contextTypes: {
		[ContextResolver]: React.PropTypes.func,
		[ContextParent]: React.PropTypes.any
	},


	[GetContext] () {
		return this.getContext ?
			this.getContext() :
			Promise.resolve([]);
	},


	resolveContext () {
		let getParentContext = this.context[ContextResolver];
		let getContext = this[GetContext];

		if (getParentContext) {
			return Promise.all([
				getParentContext(),
				getContext()]).then(x => {
					let [parent, ours] = x;

					return [].concat(parent).concat(ours);
				});
		}

		return getContext();
	}
};
