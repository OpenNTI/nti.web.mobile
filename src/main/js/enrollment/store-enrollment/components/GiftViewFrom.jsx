import React from 'react';
import cx from 'classnames';

import {validate as isEmail} from 'email-validator';

import {scoped} from 'nti-lib-locale';

let t = scoped('ENROLLMENT.forms.storeenrollment');
let t2 = scoped('ENROLLMENT');

export default class extends React.Component {
    static displayName = 'GiftFrom';

    static propTypes = {
		className: React.PropTypes.string,
		defaultValues: React.PropTypes.object,
		onChange: React.PropTypes.func
	};

    state = {
        errors: {}
    };

    getValue = () => {
		const getValue = x => x && x.value && x.value.trim();
		const values = {};

		const {from} = this;
		values[from.name] = getValue(from);

		return values;
	};

    validate = () => {
		const errors = {};
		const {from} = this;

		let {value = ''} = from;
		if (value.length === 0) {
			errors[from.name] = {message: t2('incompleteForm')};
		}
		else if (!isEmail(value)) {
			errors[from.name] = {
				message: t2('invalidEmail'),
				error: 'not an email address'
			};
		}

		const hasErrors = Object.keys(errors).length > 0;

		this.setState({errors});

		return !hasErrors;
	};

    onChange = (e) => {
		this.onFieldEventClearError(e);
		let {onChange} = this.props;
		if (onChange) {
			onChange();
		}
	};

    onFieldEventClearError = (e) => {
		let {name} = e.target;
		let {errors} = this.state;

		if (errors) {
			Object.assign({}, errors);

			delete errors[name];

			this.setState({errors});
		}
	};

    render() {
		const {state: {errors}, props: {className, defaultValues}} = this;
		return (
			<fieldset className={cx('gift-from', className)}>
				<div className="fromLabel">{t('fromLabel')}</div>
				<div className="from">
					<input name="from"
						ref={x => this.from = x}
						placeholder={t('from')}
						className={cx('required', {error: errors.from})}
						defaultValue={defaultValues.from}
						type="email"
						onChange={this.onChange}
						onFocus={this.onFieldEventClearError}
						/>
					{errors.from && <div className="error message">{errors.from.message}</div>}
				</div>
			</fieldset>
		);
	}
}
