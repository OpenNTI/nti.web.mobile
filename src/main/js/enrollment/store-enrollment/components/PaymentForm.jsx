// tell eslint that Stripe is declared elsewhere
// we're naming fields to line up with the stripe api which uses lowercase
// with underscores (e.g. exp_month vs. expMonth) so don't enforce camel case
// in this file.

import React from 'react';
import {scoped} from 'common/locale';

import FormPanel from 'common/forms/components/FormPanel';
import FormErrors from 'common/forms/components/FormErrors';

import Loading from 'common/components/Loading';

import {clearLoadingFlag} from 'common/utils/react-state';

import CreditCardForm from 'common/components/CreditCardForm';
import BillingAddress from 'common/components/BillingAddressForm';

import ExternalLibraryManager from 'common/mixins/ExternalLibraryManager';
import StoreEvents from 'common/mixins/StoreEvents';
import FormattedPriceMixin from 'enrollment/mixins/FormattedPriceMixin';

import Store from '../Store';
import {verifyBillingInfo} from '../Actions';
import {BILLING_INFO_REJECTED} from '../Constants';

const t2 = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'PaymentForm',
	mixins: [StoreEvents, FormattedPriceMixin, ExternalLibraryManager],

	backingStore: Store,
	backingStoreEventHandlers: {
		[BILLING_INFO_REJECTED]: 'onBillingRejected'
	},

	propTypes: {
		purchasable: React.PropTypes.object.isRequired
	},


	componentWillMount () {
		this.setState({ loading: true });
	},


	componentDidMount () {
		//we don't use this, but we want to put up a splash "loading" for the library at a
		//higher level than the component that uses it.
		this.ensureExternalLibrary(['jquery.payment']).then(() => clearLoadingFlag(this));
	},


	onBillingRejected (event) {
		const {response} = event;
		let {errors = {}} = this.state;
		let {error} = response;

		errors[error.param] = error;

		this.setState({ errors, busy: false });
		console.log(event);
	},


	getValues () {
		let {card, billing} = this.refs;
		return Object.assign({}, card.getValue(), billing.getValue());
	},


	validate () {
		const errors = {};

		let {card, billing} = this.refs;

		if (!card.validate()) {
			errors.card = {message: 'Please correct the errors above.'};
		}

		if (!billing.validate()) {
			errors.billing = {message: 'Please correct the errors above.'};
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

	render () {
		const {props: {purchasable: purch}, state: {busy, errors, defaultValues, loading}} = this;

		if(loading) {
			return ( <Loading /> );
		}

		const price = this.getFormattedPrice(purch.currency, purch.amount);
		const title = purch.name || null;

		let subhead = t2('enrollAsLifelongLearnerWithPrice', {price: price});

		return (
			<FormPanel onSubmit={this.handleSubmit} title={title} subhead={subhead} className="payment-form">
				<CreditCardForm defaultValues={defaultValues} ref="card"/>
				<BillingAddress defaultValues={defaultValues} ref="billing"/>
				{errors && ( <FormErrors errors={errors} /> )}
				{busy ? (
					<Loading/>
				) : (
					<input type="submit"
						id="storeenroll:submit"
						className="small-12 columns tiny button radius"
						value="Continue" />
				)}
			</FormPanel>
		);
	}

});
