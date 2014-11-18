'use strict';

var IllegalArgumentException = require('../exceptions').IllegalArgumentException;

module.exports = function Message(message, options) {
	if(!(options && options.category)) {
		throw new IllegalArgumentException('options.category is required when instantiating a new Message');
	}
	this.message = message;
	this.category = options.category;
	this.options = options;
	this.id = Date.now();
};
