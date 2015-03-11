import React from 'react';

const GetContext = 'context:provider:get-local';
const ResolveContext = 'context:provider:resolve';

export default {

	contextTypes: {
		navigationContext: React.PropTypes.func.isRequired,
		contextProvider: React.PropTypes.func
	},


	childContextTypes: {
		contextProvider: React.PropTypes.func
	},


	getChildContext () {
		return {
			contextProvider: this[ResolveContext]
		};
	},


	[GetContext] () {
		return this.getContext ?
			this.getContext() :
			Promise.resolve([]);
	},


	[ResolveContext] () {
		let getParentContext = this.context.contextProvider;
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
	},


	componentDidMount () {
		if (!this.getContext) {
			console.error('Missing getContext implementation');
		}

		this.setPageSource();
	},


	setPageSource (pageSource, currentPage) {
		let {navigationContext} = this.context;
		if (!navigationContext) {
			console.error('Expected a context method "navigationContext", but it does not exist.');
			return;
		}

		navigationContext(pageSource, currentPage, this);
	}
};
