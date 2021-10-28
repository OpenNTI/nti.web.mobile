import './BillingAddressForm.scss';
import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { Input } from '@nti/web-core';
import { scoped } from '@nti/lib-locale';

//These strings should probably move into a more generic place in the strings.
const t2 = scoped('enrollment.forms');
const t = scoped('enrollment.forms.storeenrollment', {
	address_line1: 'Address',
	address_line2: 'Address Continued',
	address_city: 'City',
	address_state: 'State/Province/Territory/Region',
	address_zip: 'Zip/Postal Code',
	address_country: 'Country',
});

const FIELDS = ['line1', 'line2', 'city', 'state', 'country', 'zip'];

export default class BillingAddressForm extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		required: PropTypes.object,
		defaultValues: PropTypes.object,
		onChange: PropTypes.func,
	};

	static defaultProps = {
		defaultValues: {},
		required: { line1: true, country: true },
	};

	state = {
		errors: {},
	};

	elements = {};

	getValue = () => {
		const getValue = x => x && x.value && x.value.trim();
		const values = {};

		for (let field of FIELDS) {
			let node = this.elements[field];
			values[node.name] = getValue(node);
		}

		return values;
	};

	validate = () => {
		const errors = {};
		const {
			props: { required },
			elements,
		} = this;
		for (let field of Object.keys(required)) {
			let { value = '' } = elements[field] || {};
			if (required[field] && value.length === 0) {
				errors[field] = { message: t2('requiredField') };
			}
		}

		const hasErrors = Object.keys(errors).length > 0;

		this.setState({ errors });

		return !hasErrors;
	};

	delegateError = err => {
		for (let key of Object.keys(err)) {
			if (FIELDS.includes(key.replace(/^address_/i, ''))) {
				this.setState({ errors: { [key]: err[key] } });
				return true;
			}
		}
	};

	onChange = (value, e) => {
		this.onFieldEventClearError(e);
		let { onChange } = this.props;
		if (onChange) {
			onChange();
		}
	};

	onFieldEventClearError = e => {
		let { name } = e.target;
		let { errors } = this.state;

		if (errors) {
			({ ...errors });

			delete errors[name.replace(/address_/, '')];

			this.setState({ errors });
		}
	};

	render() {
		const {
			props: { className, defaultValues, required },
			state: { errors = {} },
		} = this;

		return (
			<fieldset className={cx('billing-address-form', className)}>
				<legend>Billing Address</legend>
				{FIELDS.map(field => (
					<div className={`address_${field}`} key={field}>
						<Input.Text
							name={`address_${field}`}
							ref={this.getFieldRefAttachment(field)}
							placeholder={t(`address_${field}`)}
							className={cx({
								required: required[field],
								error: errors[field],
							})}
							defaultValue={defaultValues[`address_${field}`]}
							onFocus={this.onFieldEventClearError}
							onChange={this.onChange}
						/>
						{errors[field] && (
							<div className="error message">
								{errors[field].message}
							</div>
						)}
					</div>
				))}
			</fieldset>
		);
	}

	getFieldRefAttachment(field) {
		const fnName = `attachFieldRef:${field}`;
		let fn = this[fnName];
		if (!fn) {
			fn = this[fnName] = x => (this.elements[field] = x);
		}

		return fn;
	}
}
