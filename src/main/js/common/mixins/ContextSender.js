import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';
import {Mixins} from '@nti/web-commons';

import Contributor, {ContextParent} from './ContextContributor';

const logger = Logger.get('ContextSender');

const RegisterChild = 'context:child:register';
const UnregisterChild = 'context:child:unregister';
const Children = 'context:children';
const notify = 'context:notify';

const CONTEXT_DATA = Symbol();

const SET_PAGESOURCE = 'navigation:setPageSource';
const SET_CONTEXT = 'navigation:setContext';

const ContextSender = {
	mixins: [Contributor],

	contextTypes: {
		[SET_PAGESOURCE]: PropTypes.func.isRequired,
		[SET_CONTEXT]: PropTypes.func.isRequired
	},


	[RegisterChild] (child) {
		(this[Children] = (this[Children] || new Set())).add(child);
	},


	[UnregisterChild] (child) {
		let set = (this[Children] = (this[Children] || new Set()));
		let {size} = set;
		set.delete(child);
		if (size === set.size) {
			logger.error('Did not remove anything.');
		}
	},


	[notify]: function () {
		let children = this[Children] || {size: 0};
		logger.debug('Wants to Notify %d %s', children.size, this.constructor.displayName);
		if (children.size === 0) {
			logger.debug('Notify %s', this.constructor.displayName);
			let context = this[CONTEXT_DATA];
			if (context) {
				this.context[SET_PAGESOURCE](...context);
			} else {
				this.context[SET_CONTEXT](this);
			}
		}
	},


	componentDidMount () {
		if (!this.getContext) {
			this.getContext = ()=> Promise.resolve([]);
			logger.debug('Missing getContext implementation, adding empty no-op to %s', this.constructor.displayName);
		}

		let parent = this.context[ContextParent];

		if (parent && parent[RegisterChild]) {
			parent[RegisterChild](this);
		}

		this[notify]();
	},


	componentDidUpdate () {
		logger.debug('DidUp %s', this.constructor.displayName);
		this[notify]();
	},


	componentWillUnmount () {
		let parent = this.context[ContextParent];
		if (parent && parent[UnregisterChild]) {
			parent[UnregisterChild](this);
		}
		delete this[CONTEXT_DATA];
		logger.debug('WillUnMount %s', this.constructor.displayName);
	},


	setPageSource (pageSource, currentPage) {
		let children = this[Children] || {size: 0};
		let {explicitContext} = this.props || {};
		let context = [pageSource, currentPage, explicitContext || this];
		this[CONTEXT_DATA] = context;
		if (children.size === 0) {
			this.context[SET_PAGESOURCE](...context);
		}
	}
};

export const Component = createReactClass({
	displayName: 'ContextSender',
	propTypes: {
		children: PropTypes.node,
		getContext: PropTypes.func
	},
	mixins: [ContextSender, Mixins.NavigatableMixin],
	async getContext () {
		const {getContext} = this.props;
		return getContext
			? getContext.call(this)
			: [];
	},
	render () {
		return this.props.children || null;
	}
});

export default ContextSender;
