import React from 'react';

const GetContext = 'context:provider:get-local';

export default {

	contextTypes: {
		contextResolver: React.PropTypes.func,
		contextParent: React.PropTypes.any
	},


	[GetContext] () {
		return this.getContext ?
			this.getContext() :
			Promise.resolve([]);
	},


	resolveContext () {
		let getParentContext = this.context.contextResolver;
		let getContext = this[GetContext];

		if (getParentContext) {
			return Promise.all([
				getParentContext(),
				getContext()]).then(x=>{
					let [parent, ours] = x;

					return [].concat(parent).concat(ours);
				});
		}

		return getContext();
	}
};
