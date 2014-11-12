'use strict';

function IllegalArgumentException(message) {
	Error.call(this, message || 'Illegal argument. No message provided.');
}

IllegalArgumentException.prototype = Object.create(Error);
IllegalArgumentException.prototype.constructor = IllegalArgumentException;

module.exports = IllegalArgumentException;
