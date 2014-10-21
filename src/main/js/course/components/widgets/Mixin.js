'use strict';

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

			return use && this.transferPropsTo(
				exports.select(item, i, list, props));
		}.bind(this));
		return toReturn;
	}
};
