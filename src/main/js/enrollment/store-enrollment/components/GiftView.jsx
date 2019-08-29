import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {scoped} from '@nti/lib-locale';
import {StoreEventsMixin} from '@nti/lib-store';
import {getAppUser, getUserAgreementURI, ExternalLibraryManager} from '@nti/web-client';
import {Error as Err, Loading} from '@nti/web-commons';
import {rawContent} from '@nti/lib-commons';

import {clearLoadingFlag} from 'common/utils/react-state';
import FormPanel from 'forms/components/FormPanel';
import FormErrors from 'forms/components/FormErrors';
import FormattedPriceMixin from 'enrollment/mixins/FormattedPriceMixin';

const t = scoped('enrollment.gift', {
	invalid: 'Please correct the errors above.',
	payment: {
		title: 'Payment Information',
		sub: ''
	},
	purchase: 'Purchase Gift',
	terms: {
		agreement: 'I have read and agree to the <a href="%(url)s" target="_blank">licensing terms</a>.'
	}
});

import Store from '../Store';
import {verifyBillingInfo} from '../Actions';
import {BILLING_INFO_REJECTED, LOCK_SUBMIT, UNLOCK_SUBMIT} from '../Constants';


import CreditCardForm from './CreditCardForm';
import BillingAddressForm from './BillingAddressForm';
import Header from './GiftViewHeader';
import From from './GiftViewFrom';
import Recipient from './GiftRecipient';
import Pricing from './Pricing';

export default createReactClass({
	displayName: 'GiftView',
	mixins: [StoreEventsMixin, ExternalLibraryManager, FormattedPriceMixin],

	backingStore: Store,
	backingStoreEventHandlers: {
		[BILLING_INFO_REJECTED]: 'onBillingRejected',
		[UNLOCK_SUBMIT]: 'onUnlockSubmit',
		[LOCK_SUBMIT]: 'onLockSubmit'
	},

	propTypes: {
		purchasable: PropTypes.object.isRequired
	},

	attachPricingRef (x) { this.elements.Pricing = x; },
	attachFromRef (x) { this.elements.from = x; },
	attachCardRef (x) { this.elements.card = x; },
	attachBillingRef (x) { this.elements.billing = x; },
	attachRecipientRef (x) { this.elements.recipient = x; },


	getInitialState () {
		return {
			agreed: false,
			loading: true,
			submitEnabled: true,
			errors: {}
		};
	},


	componentDidMount () {
		this.elements = {};

		let defaultValues = { ...Store.getPaymentFormData()};

		const setDefaults = u => {
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
		};

		Promise.all([
			this.ensureExternalLibrary(['jquery.payment']),
			getAppUser()
				.then(setDefaults)
		])
			.then(()=> clearLoadingFlag(this))
			.catch(this.onError);

	},


	onError (error) {
		this.setState({ loading: false, error });
	},


	onBillingRejected (event) {
		const errors = { ...this.state.errors || {}};
		const {response} = event;
		const {error} = response;
		let {param: key} = error || {};

		errors[key] = error;

		// console.log(event);

		for (let ref of Object.values(this.elements)) {
			if (ref.delegateError && ref.delegateError(errors)) {
				return this.setState({busy: false, errors: {
					general: {message: t('invalid')}
				}});
			}
		}

		this.setState({ errors, busy: false });
	},


	onLockSubmit () {
		this.setState({ submitEnabled: false });
	},


	onUnlockSubmit () {
		this.setState({ submitEnabled: true });
	},


	getValues  () {
		let i, v;
		const {elements = {}} = this;
		const result = { ...this.state.defaultValues};

		for (i in elements) {
			if (!Object.prototype.hasOwnProperty.call(elements,i) || !elements[i]) { continue; }
			if (i === 'card') { continue; }

			v = elements[i];

			if (v.getData) {

				Object.assign(result, v.getData());

			} else if (v.getValue) {

				Object.assign(result, v.getValue());

			}

		}

		return result;
	},


	onAgreementCheckedChange  (e) {
		this.setState({ agreed: e.target.checked });
		this.validate();
	},


	onClick () {
		let stripeKey = this.props.purchasable.getStripeConnectKey().PublicKey;

		if (this.validate() && this.state.agreed) {
			verifyBillingInfo(stripeKey, this.getValues(), this.createToken);
		}
	},


	validate () {
		const errors = {};
		const {recipient, from, card, billing} = this.elements;

		//We let each composit field to validate itself...and show errors on
		//their own fields. We just want to report that there were errors to
		//correct at the bottom. That is way each of these assign to the same
		//key on "errors". (the key name is irrelevant)

		if (!card.validate(false)) {
			errors.sub = {message: t('invalid')};
		}

		if (!billing.validate()) {
			errors.sub = {message: t('invalid')};
		}

		if (!from.validate()) {
			errors.sub = {message: t('invalid')};
		}

		if (!recipient.validate()) {
			errors.sub = {message: t('invalid')};
		}

		this.setState({ errors });

		return Object.keys(errors).length === 0;
	},

	onCreditCardChange (createToken) {
		this.createToken = createToken;
	},

	render () {
		const {props: {purchasable}, state: {agreed, error, errors, defaultValues, loading, submitEnabled}} = this;
		let enabled = (agreed && submitEnabled);
		let submitCls = enabled ? '' : 'disabled';

		if(loading) {
			return <Loading.Mask />;
		}

		if(error) {
			return <Err error={error} />;
		}

		const agreement = t('terms.agreement', {url: getUserAgreementURI()});

		return (
			<div className="gift enrollment">
				<Pricing ref={this.attachPricingRef} purchasable={purchasable} />

				<FormPanel title={t('payment.title')} subhead={t('payment.sub')} styled={false}>
					<From ref={this.attachFromRef} defaultValues={defaultValues} />
					<CreditCardForm purchasable={purchasable} onChange={this.onCreditCardChange} ref={this.attachCardRef} defaultValues={defaultValues} className="payment-fields"/>
					<BillingAddressForm ref={this.attachBillingRef} defaultValues={defaultValues} className="payment-fields"/>
				</FormPanel>

				<Header />
				<Recipient ref={this.attachRecipientRef} />

				<FormErrors errors={errors}/>

				<div className="agreement">
					<label>
						<input type="checkbox" name="agree" checked={agreed} onChange={this.onAgreementCheckedChange}/>
						<span {...rawContent(agreement)} />
					</label>
				</div>

				<div className="button-row">
					<button
						disabled={!enabled}
						className={submitCls}
						onClick={this.onClick}>
						{t('purchase')}
					</button>
				</div>
			</div>
		);
	}
});
