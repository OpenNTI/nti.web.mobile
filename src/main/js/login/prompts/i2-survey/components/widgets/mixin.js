import React from 'react';
import Store from '../../Store';

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
