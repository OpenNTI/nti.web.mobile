import React from 'react';

const GetContext = 'context:provider:get-local';

export default {

	contextTypes: {
		navigationContext: React.PropTypes.func.isRequired,
		hasPages: React.PropTypes.func.isRequired,
		contextProvider: React.PropTypes.func
	},


	childContextTypes: {
		contextProvider: React.PropTypes.func
	},


	getChildContext () {
		return {
			contextProvider: this.resolveContext
		};
	},


	[GetContext] () {
		return this.getContext ?
			this.getContext() :
			Promise.resolve([]);
	},


	resolveContext () {
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

		let {navigationContext} = this.context;
		if (!navigationContext) {
			console.error('Expected a context method "navigationContext", but it does not exist.');
			return;
		}

		navigationContext(this);
	},


	setPageSource (pageSource, currentPage) {
		let {hasPages} = this.context;
		if (!hasPages) {
			console.error('Expected a context method "hasPages", but it does not exist.');
			return;
		}

		hasPages(pageSource, currentPage, this);
	}
};
