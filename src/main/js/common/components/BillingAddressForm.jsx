import React from 'react';
import cx from 'classnames';

import {scoped} from '../locale';

//These strings should probably move into a more generic place in the strings.
const t = scoped('ENROLLMENT.forms.storeenrollment');
const t2 = scoped('ENROLLMENT');

const FIELDS = ['line1', 'line2', 'city', 'state', 'country', 'zip'];

export default React.createClass({
	displayName: 'BillingAddressForm',

	propTypes: {
		className: React.PropTypes.string,
		required: React.PropTypes.object,
		defaultValues: React.PropTypes.object,
		onChange: React.PropTypes.func
	},


	getDefaultProps () {
		return {
			defaultValues: {},
			required: {line1: true, country: true}
		};
	},


	getInitialState () {
		return {
			errors: {}
		};
	},


	getValue () {
		const getValue = x => x && x.value && x.value.trim();
		const values = {};

		for (let field of FIELDS) {
			let node = this.refs[field];
			values[node.name] = getValue(node);
		}

		return values;
	},


	validate () {
		const errors = {};
		const {props: {required}, refs} = this;
		for (let field of Object.keys(required)) {
			let {value = ''} = refs[field] || {};
			if (required[field] && value.length === 0) {
				errors[field] = {message: t2('incompleteForm')};
			}
		}

		const hasErrors = Object.keys(errors).length > 0;

		this.setState({errors});

		return !hasErrors;
	},


	delegateError (err) {
		for (let key of Object.keys(err)) {
			if (FIELDS.includes(key.replace(/^address_/i, ''))) {
				this.setState({errors: {[key]: err[key]}});
				return true;
			}
		}
	},


	onChange (e) {
		this.onFieldEventClearError(e);
		let {onChange} = this.props;
		if (onChange) {
			onChange();
		}
	},


	onFieldEventClearError (e) {
		let {name} = e.target;
		let {errors} = this.state;

		if (errors) {
			Object.assign({}, errors);

			delete errors[name.replace(/address_/, '')];

			this.setState({errors});
		}
	},


	render () {
		const {props: {className, defaultValues, required}, state: {errors = {}}} = this;

		return (
			<fieldset className={cx('billing-address-form', className)}>
				<legend >Billing Address</legend>
				{FIELDS.map(field => (
					<div className={`address_${field}`} key={field}>
						<input name={`address_${field}`}
							ref={field}
							placeholder={t(`address_${field}`)}
							className={cx({required: required[field], error: errors[field]})}
							type="text"
							defaultValue={defaultValues[`address_${field}`]}
							onFocus={this.onFieldEventClearError}
							onChange={this.onChange}
							/>
						{errors[field] && <div className="error message">{errors[field].message}</div>}
					</div>
				))}
			</fieldset>
		);
	}
});
