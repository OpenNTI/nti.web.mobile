'use strict';

exports = module.exports = {
	_renderItems: function(items) {
		var toReturn = items && items.map(function(item, i, list) {
			return this.transferPropsTo(
				exports.select(item, i, list));
		}.bind(this));
		return toReturn;
	}
};
