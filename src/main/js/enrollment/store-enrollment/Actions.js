'use strict';

var Promise = global.Promise || require('es6-promise').Promise;

module.exports = {
	getPricing: function() {
		return Promise.resolve('testing testing testing');
	}
};
