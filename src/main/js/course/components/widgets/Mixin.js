import React from 'react';

export class IllegalStateException {
	constructor (message) {
		let {stack} = new Error(message);
		Object.assign(this, {message, stack});
	}
}


/**
 * Do NOT directly import this from any other package. If you want to mix
 * this into something, use the named Mixin export on the index module.
 *
 * Import order is VERY important with this.
 *
 * Our ES6 loader module for WebPack makes this cyclical import possible.
 *
 * index.js imports this module too... but note the order and where it occurs.
 *
 * In general, this import pattern is very frowned upon, however, we are leveraging
 * this because we need the data-driven widget selection. And at least one of them,
 * can have children, so this code will be repeated. We could unwind it and
 * introduce potential inconsistencies, but I'm betting that this small stress
 * point will not be an issue provided no one copies this pattern without fully
 * understanding the ramifications. This is advanced, do not replicate willy-nilly.
 */
import {select} from './index';

export default {

	contextTypes: {
		assignments: React.PropTypes.object
	},

	childContextTypes: {
		assignments: React.PropTypes.object
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
