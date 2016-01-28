// tell eslint that Stripe is declared elsewhere
// we're naming fields to line up with the stripe api which uses lowercase
// with underscores (e.g. exp_month vs. expMonth) so don't enforce camel case
// in this file.

import React from 'react';
import {scoped} from 'common/locale';

import FormPanel from 'common/forms/components/FormPanel';
import FormErrors from 'common/forms/components/FormErrors';

import Loading from 'common/components/Loading';
import LoadingInline from 'common/components/TinyLoader';

import {getAppUser} from 'common/utils';
import {clearLoadingFlag} from 'common/utils/react-state';


import ExternalLibraryManager from 'common/mixins/ExternalLibraryManager';
import StoreEvents from 'common/mixins/StoreEvents';

import BillingAddress from './BillingAddressForm';
import CreditCardForm from './CreditCardForm';
import TermsCheckbox from './TermsCheckbox';
import Pricing from './Pricing';

import Store from '../Store';
import {verifyBillingInfo} from '../Actions';
import {BILLING_INFO_REJECTED} from '../Constants';

const t = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'PaymentForm',
	mixins: [StoreEvents, ExternalLibraryManager],

	backingStore: Store,
	backingStoreEventHandlers: {
		[BILLING_INFO_REJECTED]: 'onBillingRejected'
	},

	propTypes: {
		purchasable: React.PropTypes.object.isRequired
	},


	componentWillMount () {
		let defaultValues = Object.assign({}, Store.getPaymentFormData());

		getAppUser().then(u => {
			let {defaultValues: current = {}} = this.state;
			let o = {};

			if (u && !current.from) {
				o.from = u.email;
			}

			if (u && !current.name) {
				o.name = u.realname;
			}

			if (Object.keys(o).length) {
				defaultValues = Object.assign(o, defaultValues);
				this.setState({ defaultValues });
			}
		});

		this.setState({  loading: true, defaultValues });
	},


	componentDidMount () {
		//we don't use this, but we want to put up a splash "loading" for the library at a
		//higher level than the component that uses it.
		this.ensureExternalLibrary(['jquery.payment']).then(() => clearLoadingFlag(this));
	},


	onBillingRejected (event) {
		const errors = Object.assign({}, this.state.errors || {});
		const {response} = event;
		const {error} = response;

		errors[error.param] = error;

		// console.log(event);

		for (let ref of Object.values(this.refs)) {
			if (ref.delegateError && ref.delegateError(errors)) {
				return this.setState({busy: false, errors: {
					general: {message: t('invalidForm')}
				}});
			}
		}

		this.setState({ errors, busy: false });
	},


	getValues () {
		let {pricing, card, billing} = this.refs;
		return Object.assign({}, card.getValue(), billing.getValue(), pricing.getData());
	},


	validate () {
		const errors = {};

		let {card, billing} = this.refs;

		//We let each composit field to validate itself...and show errors on
		//their own fields. We just want to report that there were errors to
		//correct at the bottom. That is way each of these assign to the same
		//key on "errors". (the key name is irrelevant)


		if (!card.validate(false)) {
			errors.sub = {message: 'Please correct the errors above.'};
		}

		if (!billing.validate()) {
			errors.sub = {message: 'Please correct the errors above.'};
		}

		this.setState({ errors });
		return Object.keys(errors).length === 0;
	},


	handleSubmit (event) {
		event.preventDefault();

		if(!this.validate()) {
			return;
		}

		this.setState({ busy: true });

		let stripeKey = this.props.purchasable.getStripeConnectKey().PublicKey;

		verifyBillingInfo(stripeKey, this.getValues());
	},

	termsCheckboxChange (termsChecked) {
		this.validate();
		this.setState({ termsChecked });
	},

	render () {
		const {props: {purchasable: purch}, state: {busy, errors, defaultValues, loading, termsChecked}} = this;

		if(loading) {
			return ( <Loading /> );
		}

		const title = purch.name || null;

		return (
			<FormPanel onSubmit={this.handleSubmit} title={title} className="payment-form">
				<Pricing ref="pricing" purchasable={purch} />
				<CreditCardForm defaultValues={defaultValues} ref="card"/>
				<BillingAddress defaultValues={defaultValues} ref="billing"/>
				{errors && ( <FormErrors errors={errors} /> )}
				<TermsCheckbox onChange={this.termsCheckboxChange}/>
				{busy ? (
					<div><LoadingInline/></div>
				) : (
					<input type="submit"
						id="storeenroll:submit"
						disabled={!termsChecked}
						className="small-12 columns tiny button radius"
						value="Continue" />
				)}
			</FormPanel>
		);
	}

});
