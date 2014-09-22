'use strict';

function IllegalArgumentException(message) {
	this.name = 'IllegalArgumentException';
	this.message = message || 'Illegal argument. No message provided.';
	this.stack = (new Error()).stack;
}
IllegalArgumentException.prototype = new Error();
IllegalArgumentException.prototype.constructor = IllegalArgumentException;

module.exports = IllegalArgumentException;
