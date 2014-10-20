'use strict';

exports = module.exports = {
	_renderItems: function(items, props) {
		var toReturn = items && items.map(function(item, i, list) {
			return this.transferPropsTo(
				exports.select(item, i, list, props));
		}.bind(this));
		return toReturn;
	}
};
