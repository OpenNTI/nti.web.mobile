import './CreditCardForm.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {decorate} from '@nti/lib-commons';
import {mixin} from '@nti/lib-decorators';
import {ExternalLibraryManager} from '@nti/web-client';
import {scoped} from '@nti/lib-locale';
import { CreditCard } from '@nti/web-payments';


const t = scoped('enrollment.forms', {
	requiredField: 'Field is required.'
});

class CreditCardForm extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		required: PropTypes.object,
		onChange: PropTypes.func.isRequired,
		defaultValues: PropTypes.object,
		purchasable: PropTypes.object
	}

	static defaultProp = {
		required: {name: true, number: true, expiry: true, cvc: true}
	}

	state = {
		errors: null,
		empty: {name: true, number: true, expiry: true, cvc: true},
		valid: false
	}

	onChange = ({ complete, errors, empty, createToken }) => {
		if (complete && !errors) {
			this.props.onChange(createToken);
			this.setState({ valid: true, errors: null, empty });
		} else {
			this.setState({ valid: false, errors: null, empty });
		}
	}

	validate () {
		const {valid, empty} = this.state;

		if (valid) {return true;}

		if (empty) {
			const errors = {};

			if (empty.name) {
				errors['data-name-error'] = true;
			}

			if (empty.number) {
				errors['data-number-error'] = true;
			}

			if (empty.expiry) {
				errors['data-expiry-error'] = true;
			}

			if (empty.cvc) {
				errors['data-cvc-error'] = true;
			}

			this.setState({
				errors
			});
		}

		return false;
	}


	render () {
		const {
			props: { className, defaultValues = {}, purchasable },
			state: {errors}
		} = this;

		return (
			<fieldset className={cx('credit-card-form', className)} {...(errors || {})}>
				<legend>Credit Card</legend>
				<CreditCard onChange={this.onChange} purchasable={purchasable} defaultValues={defaultValues} />
				{errors && (
					<div className="error-message">
						{t('requiredField')}
					</div>
				)}
			</fieldset>
		);
	}
}

export default decorate(CreditCardForm, [
	mixin(ExternalLibraryManager)
]);
