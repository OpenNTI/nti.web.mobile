import PropTypes from 'prop-types';

export class IllegalStateException {
	constructor (message) {
		let {stack} = new Error(message);
		Object.assign(this, {message, stack});
	}
}

import {select} from './index';

export default {

	contextTypes: {
		assignments: PropTypes.object
	},

	childContextTypes: {
		assignments: PropTypes.object
	},

	getChildContext () {
		let {assignments} = this.state || {};
		return {assignments};
	},

	renderItems (items, props) {
		let s = this.state || {};
		let p = this.props || {};

		let assignments = this.context.assignments || s.assignments;

		let node = s.node || p.node || (props && props.node);

		let toReturn = items && items.map((item, i, list) => {
			let use = !!item;
			let itemProps = Object.assign({}, props, p, {node: node});

			return use && select.call(this, item, i, list, itemProps, node, assignments);

		}).filter(x=>x);

		if (!toReturn || toReturn.length === 0) {
			throw new IllegalStateException('No Items to render');
		}

		return toReturn;
	}
};
