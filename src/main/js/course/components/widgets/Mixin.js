import {IllegalStateException} from 'common/exceptions';

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

	renderItems (items, props) {
		let s = this.state || {};
		let p = this.props || {};
		let node = s.node || p.node || (props && props.node);
		let status = node && node.parent('isEnrollment').getStatus();

		let toReturn = items && items.map((item, i, list)=>{
			let use = true;
			let itemProps = Object.assign({}, props, p, {node: node});

			if (node && !node.hasVisibility(item, status)) {
				use = null;
			}

			use = use && select(item, i, list, itemProps, node);

			return use;

		}).filter(x=>x);

		if (toReturn.length === 0) {
			throw new IllegalStateException('No Items to render');
		}

		return toReturn;
	}
};
