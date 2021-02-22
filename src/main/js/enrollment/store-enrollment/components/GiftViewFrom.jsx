import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { validate as isEmail } from 'email-validator';
import { scoped } from '@nti/lib-locale';

const t = scoped('enrollment.forms', {
	incompleteForm: 'Please complete all required fields.',
	invalidEmail: 'Invalid Email.',

	storeenrollment: {
		from: 'Email Address',
		fromLabel: 'This is where we will send your purchase confirmation.',
	},
});

export default class GiftFrom extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		defaultValues: PropTypes.object,
		onChange: PropTypes.func,
	};

	state = {
		errors: {},
	};

	attachFormRef = x => (this.from = x);

	getValue = () => {
		const getValue = x => x && x.value && x.value.trim();
		const values = {};

		const { from } = this;
		values[from.name] = getValue(from);

		return values;
	};

	validate = () => {
		const errors = {};
		const { from } = this;

		let { value = '' } = from;
		if (value.length === 0) {
			errors[from.name] = { message: t('incompleteForm') };
		} else if (!isEmail(value)) {
			errors[from.name] = {
				message: t('invalidEmail'),
				error: 'not an email address',
			};
		}

		const hasErrors = Object.keys(errors).length > 0;

		this.setState({ errors });

		return !hasErrors;
	};

	onChange = e => {
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

			delete errors[name];

			this.setState({ errors });
		}
	};

	render() {
		const {
			state: { errors },
			props: { className, defaultValues },
		} = this;
		return (
			<fieldset className={cx('gift-from', className)}>
				<div className="fromLabel">
					{t('storeenrollment.fromLabel')}
				</div>
				<div className="from">
					<input
						name="from"
						ref={this.attachFormRef}
						placeholder={t('storeenrollment.from')}
						className={cx('required', { error: errors.from })}
						defaultValue={defaultValues.from}
						type="email"
						onChange={this.onChange}
						onFocus={this.onFieldEventClearError}
					/>
					{errors.from && (
						<div className="error message">
							{errors.from.message}
						</div>
					)}
				</div>
			</fieldset>
		);
	}
}
