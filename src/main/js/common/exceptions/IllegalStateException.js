'use strict';

function IllegalStateException(message) {
	Error.call(this, message || 'Illegal State. No message provided.');
}

IllegalStateException.prototype = Object.create(Error);
IllegalStateException.prototype.constructor = IllegalStateException;

module.exports = IllegalStateException;
