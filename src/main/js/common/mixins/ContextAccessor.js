import React from 'react';
import wait from 'nti.lib.interfaces/utils/wait';

const GetContext = 'context:provider:get-local';

export const ContextParent = 'context:provider:parent';
export const ContextResolver = 'context:provider:resolver';

const RESOLVING = Symbol('resolvingContext');

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
		let work = () => {
			let getParentContext = this.context[ContextResolver];
			let getContext = this[GetContext];

			return !getParentContext
				? getContext()
				: Promise.all([
					getParentContext(),
					getContext()
				]).then(x => x.reduce((a, b) => a.concat(b), []));
		};

		if (!this[RESOLVING]) {
			this[RESOLVING] = work();

			this[RESOLVING]
				// .then(x => console.log(x.map(i=>i.label)))
				.catch(()=>{})//prevent errors from stoping cleanup.
				.then(()=> wait(1000))//1 second
				.then(()=> delete this[RESOLVING]);
		}

		return this[RESOLVING];
	}
};
