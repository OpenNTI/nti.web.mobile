import React from 'react';

export function evaluate (form, requirement = []) {
	const fieldMap = {};

	if (!form) {
		return requirement.length === 0;
	}

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
		let f = form.elements[field];
		if(!f) {
			return false; // required field is not in the form
		}
		for(let value of fieldMap[field]) {
			let fieldValue = f.value || '';
			if(f.value == null) { // IE doesn't support field.value on a radio group
				fieldValue = (form.querySelector(`input[name=${field}]:checked`) || {}).value || '';
			}
			if (fieldValue === value || value === true && fieldValue.trim().length > 0) {
				continue outer;
			}
		}
		return false;
	}
	return true;
}

export default {
	contextTypes: {
		getForm: React.PropTypes.func
	},

	propTypes: {
		requirement: React.PropTypes.arrayOf(React.PropTypes.string)
	},

	componentDidUpdate () {
		const lastState = this.satisfied;
		if (lastState !== this.satisfiesRequirement()) {
			this.forceUpdate();
		}
	},

	getForm () { return this.context.getForm(); },

	satisfiesRequirement () {
		const {requirement = []} = this.props;

		return this.satisfied = evaluate(this.getForm(), requirement);
	}

};
