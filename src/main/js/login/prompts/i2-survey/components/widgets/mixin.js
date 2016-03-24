import React from 'react';

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

	satisfiesRequirement () {
		const {requirement = []} = this.props;
		const form = this.context.getForm();
		if (!form) {
			return true;
		}
		function evaluate () {
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
				let f = form.elements[field];
				if(!f) {
					return false; // required field is not in the form
				}
				for(let value of fieldMap[field]) {
					const fieldValue = f.value || '';
					if (fieldValue === value || value === true && fieldValue.trim().length > 0) {
						continue outer;
					}
				}
				return false;
			}
			return true;
		}

		return this.satisfied = evaluate();
	}

};
