import Contributor, {ContextParent} from './ContextContributor';

import * as Actions from 'navigation/Actions';

const RegisterChild = 'context:child:register';
const UnregisterChild = 'context:child:unregister';
const Children = 'context:children';
const notify = 'context:notify';

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

		this[notify]();
	},


	[notify] () {
		let children = this[Children] || {size: 0};
		if (children.size === 0) {
			Actions.setContext(this);
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


	componentWillReceiveProps () {
		this[notify]();
	},


	componentWillUnmount () {
		let parent = this.context[ContextParent];
		if (parent && parent[UnregisterChild]) {
			parent[UnregisterChild](this);
		}
	},


	setPageSource (pageSource, currentPage) {
		let children = this[Children] || {size: 0};
		if (children.size === 0) {
			Actions.setPageSource(pageSource, currentPage, this);
		}
	}
};
