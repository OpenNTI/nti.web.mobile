'use strict';

var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = require('common/constants/Events').CHANGE_EVENT;
// var isFunction = require('dataserverinterface/utils/isfunction');
var Constants = require('./Constants');

// store field values outside of component state
// so we can update without triggering a re-render.
var FieldValuesStore = Object.assign({}, EventEmitter.prototype, {

	_fieldValues: {},
	_availableFields: new Set(),

	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	emitChange: function(evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	getValues: function() {
		return Object.assign({}, this._fieldValues);
	},

	setValue: function(name, value) {
		this._fieldValues[name] = value;
	},

	getValue: function(name) {
		return this._fieldValues[name];
	},

	clearValue: function(name) {
		delete this._fieldValues[name];
	},

	__setsAreEquivalent: function(set1, set2) {
		if(set1 instanceof Set && set2 instanceof Set && set1.size === set2.size) {
			var v = set1.values();
			while(true) {
				var val = v.next();
				if (val.done) {
					return true;
				}
				if (!set2.has(val.value)) {
					return false;
				}
			}
		}
		return false;
	},

	setAvailableFields: function(fieldNames) {
		var oldFields = this._availableFields;
		this._availableFields = new Set(fieldNames);
		// only emit change if the fields actually changed.
		// otherwise we trigger an infinite loop:
		// fields change triggers a render which triggers a fields change
		if (!this.__setsAreEquivalent(oldFields, this._availableFields)) {
			this.pruneValues(fieldNames);
			this.emitChange({
				type: Constants.AVAILABLE_FIELDS_CHANGED,
				fields: new Set(this._availableFields)
			});	
		}
	},

	updateFieldValue: function(event) {
		var target = event.target;
		var field = target.name;
		var value = target.value;

		if(target.type === 'checkbox' && !target.checked) {
			delete this._fieldValues[field];
		}
		else if (value || this._fieldValues.hasOwnProperty(field)) {
			// ^ don't set an empty value if there's not already
			// an entry for this field in this.state.fieldValues
			this.setValue(field, value);
		}
		this.emitChange({
			type: Constants.FIELD_VALUE_CHANGE,
			fieldName: field,
			fieldValue: value
		});

		// if (isFunction(this.props.onFieldValuesChange)) {
		// 	this.props.onFieldValuesChange(this.getValues());
		// }
	},

	/**
	* Clear values whose names are not in keep
	* @param keep {Set} The set of field names to keep.
	*/
	pruneValues: function(keep) {
		var removed = [];
		var fieldValues = this._fieldValues;
		Object.keys(fieldValues).forEach(function(key) {
			if (!keep.has(key)) {
				delete fieldValues[key];
				removed.push(key);
			}
		});
		if(removed.length > 0) {
			this.emitChange({
				type: Constants.FIELD_VALUES_REMOVED,
				removed: removed
			});
		}
	}

});

module.exports = FieldValuesStore;
