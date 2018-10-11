import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Loading} from '@nti/web-commons';
import {mixin} from '@nti/lib-decorators';
import {ExternalLibraryManager} from '@nti/web-client';
import {scoped} from '@nti/lib-locale';
import { CreditCard } from '@nti/web-payments';

import {clearLoadingFlag} from 'common/utils/react-state';

const t = scoped('enrollment.forms', {
	invalidExpiration: 'Expiration is invalid.',
	invalidCardNumber: 'Card number is invalid.',
	invalidCVC: 'CVC is invalid.',
	requiredField: 'Field is required.',

	storeenrollment: {
		cvc: 'Code',
		name: 'Name on Card',
		number: '1234 1234 1234 1234',
		exp_: 'MM / YY',
	}
});

export default
@mixin(ExternalLibraryManager)
class CreditCardForm extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		defaultValues: PropTypes.object,
		purchasable: PropTypes.object
	}

	state = {
		errors: null,
		loading: true,
		valid: false
	}

	componentDidMount () {
		this.ensureExternalLibrary(['stripe'])
			.then(() => clearLoadingFlag(this));
	}

	onChange = ({ complete, errors, createToken }) => {
		if (complete && !errors) {
			this.props.onChange(createToken);
			this.setState({ valid: true });
		} else {
			this.setState({ valid: false, errors });
		}
	}

	validate () {
		return this.state.valid;
	}

	render () {
		const { props: { className, defaultValues = {}, purchasable }, state: {loading }} = this;

		if (loading) {
			return ( <Loading.Ellipse/> );
		}

		return (
			<fieldset className={cx('credit-card-form', className)}>
				<legend>Credit Card</legend>
				<CreditCard onChange={this.onChange} purchasable={purchasable} defaultValues={defaultValues} />
			</fieldset>
		);
	}
}
