import {EventEmitter} from 'events';
import {CHANGE_EVENT} from 'common/constants/Events';
// import isFunction from 'nti.lib.interfaces/utils/isfunction';
import Constants from './Constants';

// store field values outside of component state
// so we can update without triggering a re-render.
export default Object.assign({}, EventEmitter.prototype, {

	fieldValues: {},
	availableFields: new Set(),

	addChangeListener (callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	emitChange (evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	getValues () {
		return Object.assign({}, this.fieldValues);
	},

	setValue (name, value) {
		this.fieldValues[name] = value;
	},

	getValue (name) {
		return this.fieldValues[name];
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
		let {target} = event.target;
		let {field, value} = target;

		if(target.type === 'checkbox' && !target.checked) {
			delete this.fieldValues[field];
		}
		else if (value || this.fieldValues.hasOwnProperty(field)) {
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
