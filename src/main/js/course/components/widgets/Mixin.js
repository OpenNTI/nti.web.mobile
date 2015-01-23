'use strict';

var IllegalStateException = require('common/exceptions').IllegalStateException;

exports = module.exports = {
	_renderItems: function(items, props) {
		var s = this.state || {};
		var p = this.props || {};
		var node = s.node || p.node || (props && props.node);
		var status = node && node.parent('isEnrollment').getStatus();

		var toReturn = items && items.map((item, i, list)=>{
			var use = true;
			var itemProps = Object.assign({}, props, p, {node: node});

			if (node && !node.hasVisibility(item, status)) {
				use = null;
			}

			use = use && exports.select(item, i, list, itemProps, node);

			return use;

		}).filter(x=>x);

		if (toReturn.length === 0) {
			throw new IllegalStateException('No Items to render');
		}

		return toReturn;
	}
};
