import {EventEmitter} from 'events';
import {CHANGE_EVENT} from 'nti-lib-store';
// import isFunction from 'is-function';
import * as Constants from './Constants';

// store field values outside of component state
// so we can update without triggering a re-render.
export default Object.assign({}, EventEmitter.prototype, {

	fieldValues: {},
	availableFields: new Set(),
	autopopulator: null,

	addChangeListener (callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	emitChange (evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	getValues (stripEmpty = false) {
		let vals = this.preprocess(Object.assign({}, this.fieldValues));
		return stripEmpty ? this.stripEmptyValues(vals) : vals;
	},

	stripEmptyValues (values) {
		return Object.keys(values || {}).reduce((previous, current) => {
			if (typeof values[current] !== 'string' || values[current].trim().length > 0) {
				previous[current] = values[current];
			}
			return previous;
		}, {});
	},

	setValue (name, value) {
		this.fieldValues[name] = value;
	},

	preprocess (values) {
		return this.autopopulator && this.autopopulator.preprocess ? this.autopopulator.preprocess(values) : values;
	},

	autopopulatedValue (name) {
		return this.autopopulator ? this.autopopulator.valueFor(name) : undefined;
	},

	getValue (name) {
		let v = this.fieldValues[name];
		if (!v) {
			v = this.autopopulatedValue(name);
			if (v) {
				this.setValue(name, v);
			}
		}
		return v;
	},

	setAutopopulator (autopop) {
		this.autopopulator = autopop;
	},

	clearValue (name) {
		delete this.fieldValues[name];
	},

	setAvailableFields (fieldNames) {
		let oldFields = this.availableFields;
		this.availableFields = new Set(fieldNames);
		// only emit change if the fields actually changed.
		// otherwise we trigger an infinite loop:
		// fields change triggers a render which triggers a fields change
		if (!setsAreEquivalent(oldFields, this.availableFields)) {
			this.pruneValues(fieldNames);
			this.emitChange({
				type: Constants.AVAILABLE_FIELDS_CHANGED,
				fields: new Set(this.availableFields)
			});
		}
	},

	updateFieldValue (event) {
		let {target} = event;
		let {name, value} = target;

		if(target.type === 'checkbox' && !target.checked) {
			delete this.fieldValues[name];
		}
		else if (value || this.fieldValues.hasOwnProperty(name)) {
			// ^ don't set an empty value if there's not already
			// an entry for this field in this.state.fieldValues
			this.setValue(name, value);
		}
		this.emitChange({
			type: Constants.FIELD_VALUE_CHANGE,
			fieldName: name,
			fieldValue: value,
			target
		});

		// if (isFunction(this.props.onFieldValuesChange)) {
		// 	this.props.onFieldValuesChange(this.getValues());
		// }
	},

	/**
	 * Clear values whose names are not in keep
	 *
	 * @param {Set} keep The set of field names to keep.
	 * @return {void}
	 */
	pruneValues (keep) {
		let removed = [];
		let {fieldValues} = this;
		Object.keys(fieldValues).forEach(key => {
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

function setsAreEquivalent (set1, set2) {
	if(set1 instanceof Set && set2 instanceof Set && set1.size === set2.size) {
		let val, v = set1.values();
		do {
			val = v.next();
			if (val.done) {
				return true;
			}
			if (!set2.has(val.value)) {
				return false;
			}
		} while(!val.done);
	}
	return false;
}
