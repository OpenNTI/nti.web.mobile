'use strict';

var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = require('./constants/Events').CHANGE_EVENT;

/**
* We frequently emit events with a type field specified via a constant.
* Occasionally the constant is not defined or misspelled, resulting in
* an event with an undefined type.
* 
* This emitChange implementation checks for a type before emitting, throws
* an error if it's undefined.
**/

var TypedEmitter = Object.assign({}, EventEmitter.prototype, {
	emitChange: function(event) {
		if (!event.type) {
			throw new Error('Event must have a type.', event);
		}
		this.emit(CHANGE_EVENT, event);
	}
});

console.debug(TypedEmitter);

module.exports = TypedEmitter;

// var Store = Object.assign({}, TypedEmitter, {
// 	... 
// });
