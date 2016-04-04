import React from 'react';
import Store from '../../Store';
import StoreEvents from 'common/mixins/StoreEvents';

export function evaluate (requirement = []) {
	const fieldMap = {};


	for(let r of requirement) {
		let [field, value = true] = r.split('=');
		let values = fieldMap[field] || [];
		if (!values.includes(value)) {
			values.push(value);
		}
		fieldMap[field] = values;
	}


	outer:
	for(let field of Object.keys(fieldMap)) {
		for(let value of fieldMap[field]) {
			let fieldValue = Store.getValue(field) || ''; // f.value || '';
			if (fieldValue === value || value === true && fieldValue.trim().length > 0) {
				continue outer;
			}
		}
		return false;
	}
	return true;
}

export default {

	mixins: [StoreEvents],

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'onStoreChange'
	},

	// onStoreChange (e) {
	// 	if (this.requirementFields().indexOf(e.field) > -1) {
	// 	}
	// },

	// requirementFields () {
	// 	const {requirement = []} = this.props;
	// 	return requirement.map(r => r.split('=')[0]);
	// },

	propTypes: {
		requirement: React.PropTypes.arrayOf(React.PropTypes.string)
	},

	componentDidUpdate () {
		const lastState = this.satisfied;
		if (lastState !== this.satisfiesRequirement()) {
			this.forceUpdate();
		}
	},

	satisfiesRequirement () {
		const {requirement = []} = this.props;

		return this.satisfied = evaluate(requirement);
	}

};
