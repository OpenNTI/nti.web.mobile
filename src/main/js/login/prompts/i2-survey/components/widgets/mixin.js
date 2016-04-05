import React from 'react';

import StoreEvents from 'common/mixins/StoreEvents';

import Store from '../../Store';

export const optionValue = (option) => typeof option === 'object' ? option.value : option;

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

	propTypes: {
		requirement: React.PropTypes.arrayOf(React.PropTypes.string)
	},

	mixins: [StoreEvents],

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'onStoreChange'
	},

	onStoreChange (e) {
		if(this.hasDependency(e.field)) {
			const {element: {name}} = this.props;
			Store.clearValue(name);
		}
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
	},

	hasDependency (name) {
		const {element = {}} = this.props;

		if (hasDependency(element.requirement, name) || (element.options || []).some(o => hasDependency(o.requirement, name))) {
			return true;
		}
		return false;
	}

};


function hasDependency (requirement = [], name) {
	return requirement.some(r => {
		const [field] = r.split('=');
		return field === name;
	});
}
