import Contributor, {ContextParent} from './ContextContributor';

import * as Actions from 'navigation/Actions';

const RegisterChild = 'context:child:register';
const UnregisterChild = 'context:child:unregister';
const Children = 'context:children';
const notify = 'context:notify';

const CONTEXT_DATA = Symbol();

export default {
	mixins: [Contributor],


	[RegisterChild] (child) {
		(this[Children] = (this[Children] || new Set())).add(child);
	},


	[UnregisterChild] (child) {
		let set = (this[Children] = (this[Children] || new Set()));
		let {size} = set;
		set.delete(child);
		if (size === set.size) {
			console.error('Did not remove anything.');
		}
	},


	[notify] () {
		let children = this[Children] || {size: 0};
		// console.debug('Wants to Notify', children.size, (this.constructor || {}).displayName);
		if (children.size === 0) {
			// console.debug('Notify', (this.constructor || {}).displayName, this.isMounted());
			let context = this[CONTEXT_DATA];
			if (context) {
				Actions.setPageSource(...context);
			} else {
				Actions.setContext(this);
			}
		}
	},


	componentDidMount () {
		if (!this.getContext) {
			this.getContext = ()=> Promise.resolve([]);
			//console.warn('Missing getContext implementation, adding empty no-op to %s', this.constructor.displayName);
		}

		let parent = this.context[ContextParent];

		if (parent && parent[RegisterChild]) {
			parent[RegisterChild](this);
		}

		this[notify]();
	},


	// componentWillReceiveProps () { this[notify](); },
	componentDidUpdate () { this[notify](); },


	componentWillUnmount () {
		let parent = this.context[ContextParent];
		if (parent && parent[UnregisterChild]) {
			parent[UnregisterChild](this);
		}
		delete this[CONTEXT_DATA];
	},


	setPageSource (pageSource, currentPage) {
		let children = this[Children] || {size: 0};
		let {explicitContext} = this.props || {};
		let context = [pageSource, currentPage, explicitContext || this];
		this[CONTEXT_DATA] = context;
		if (children.size === 0) {
			Actions.setPageSource(...context);
		}
	}
};
