'use strict';

var IllegalStateException = require('common/exceptions').IllegalStateException;
var truthy = require('dataserverinterface/utils/identity');

exports = module.exports = {
	_renderItems: function(items, props) {
		var s = this.state || {};
		var p = this.props || {};
		var node = s.node || p.node || (props && props.node);
		var status = node && node.up('isEnrollment').getStatus();

		var toReturn = items && items.map(function(item, i, list) {
			var use = true;

			if (node && !node.hasVisibility(item, status)) {
				use = null;
			}

			use = use && exports.select(item, i, list, props);

			return use && this.transferPropsTo(use);
		}.bind(this)).filter(truthy);

		if (toReturn.length === 0) {
			throw new IllegalStateException('No Items to render');
		}

		return toReturn;
	}
};
