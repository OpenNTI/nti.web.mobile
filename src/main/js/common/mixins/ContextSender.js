import Contributor from './ContextContributor';

import {setPageSource, setContext} from 'navigation/Actions';

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
		if (size===set.size) {
			console.error('Did not remove anything.');
		}
	},


	[notify] () {
		let children = this[Children] || {size:0};
		if (children.size === 0) {
			setContext(this);
		}
	},


	componentDidMount () {
		if (!this.getContext) {
			this.getContext = ()=> Promise.resolve([]);
			console.warn('Missing getContext implementation, adding empty no-op.');
		}

		let {contextParent} = this.context;

		if (contextParent && contextParent[RegisterChild]) {
			contextParent[RegisterChild](this);
		}

		this[notify]();
	},


	componentWillReceiveProps () {
		this[notify]();
	},


	componentWillUnmount () {
		let {contextParent} = this.context;
		if (contextParent && contextParent[UnregisterChild]) {
			contextParent[UnregisterChild](this);
		}
	},


	setPageSource (pageSource, currentPage) {
		let children = this[Children] || {size:0};
		if (children.size === 0) {
			setPageSource(pageSource, currentPage, this);
		}
	}
};
