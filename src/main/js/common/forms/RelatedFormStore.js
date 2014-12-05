'use strict';

var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = require('common/constants/Events').CHANGE_EVENT;

var _values = {};

// stashing values here under a contextid for a RelatedFormPanel
// and all its subforms provides an easy way to keep
// track of the merged set of field values.
module.exports = Object.assign({}, EventEmitter.prototype, {

	_emitChange: function(event) {
		this.emit(CHANGE_EVENT, event);
	},

	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	newContext: function() {
		var id = 'ctx'.concat(Date.now());
		_values[id] = {};
		this._emitChange({
			type: 'RelatedFormStoreContextCreated',
			payload: {
				contextId: id
			}
		});
		return id;
	},

	setValue: function(contextId, name, value) {
		_values[contextId][name] = value;
		this._emitChange({
			type: 'RelatedFormStoreValueSet',
			payload: {
				contextId: contextId,
				name: name,
				value: value
			}
		});
	},

	clearValues: function(contextId, names) {
		(names||[]).forEach(function(key) {
			delete _values[contextId][key];
		});
		this._emitChange({
			type: 'RelatedFormStoreValuesDeleted',
			payload: {
				contextId: contextId,
				names: names
			}
		});
	},

	getValues: function(contextId) {
		return _values[contextId]||{};
	}

});
