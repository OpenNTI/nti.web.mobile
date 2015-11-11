import React from 'react';

import {scoped} from 'common/locale';
import {getAppUser} from 'common/utils';
import {clearLoadingFlag} from 'common/utils/react-state';

let t = scoped('ENROLLMENT');
let tGift = scoped('ENROLLMENT.GIFT');

import Err from 'common/components/Error';
import Loading from 'common/components/Loading';
import Localized from 'common/components/LocalizedHTML';
import CreditCardForm from 'common/components/CreditCardForm';
import BillingAddressForm from 'common/components/BillingAddressForm';

import FormPanel from 'common/forms/components/FormPanel';
import FormErrors from 'common/forms/components/FormErrors';

import ExternalLibraryManager from 'common/mixins/ExternalLibraryManager';
import StoreEvents from 'common/mixins/StoreEvents';

import FormattedPriceMixin from 'enrollment/mixins/FormattedPriceMixin';

import Store from '../Store';
import * as Actions from '../Actions';
import {BILLING_INFO_REJECTED, LOCK_SUBMIT, UNLOCK_SUBMIT} from '../Constants';

import Header from './GiftViewHeader';
import From from './GiftViewFrom';
import Recipient from './GiftRecipient';
import Pricing from './Pricing';

let agreementURL = '/mobile/api/user-agreement/view';

export default React.createClass({
	displayName: 'GiftView',
	mixins: [StoreEvents, ExternalLibraryManager, FormattedPriceMixin],

	backingStore: Store,
	backingStoreEventHandlers: {
		[BILLING_INFO_REJECTED]: 'onBillingRejected',
		[UNLOCK_SUBMIT]: 'onUnlockSubmit',
		[LOCK_SUBMIT]: 'onLockSubmit'
	},

	propTypes: {
		purchasable: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {
			agreed: false,
			loading: true,
			submitEnabled: true,
			errors: {}
		};
	},


	componentWillMount () {
		let initialValues = Object.assign({}, Store.getPaymentFormData());

		getAppUser().then(u => {
			let {initialValues: current = {}} = this.state;
			let o = {};

			if (u && !current.from) {
				o.from = u.email;
			}

			if (u && !current.name) {
				o.name = u.realname;
			}

			if (Object.keys(o).length) {
				initialValues = Object.assign(o, initialValues);
				this.setState({ initialValues });
			}
		});

		this.setState({ initialValues });
	},


	componentDidMount () {
		this.ensureExternalLibrary(['jquery.payment'])
			.then(()=> clearLoadingFlag(this))
			.catch(this.onError);
	},


	onError (error) {
		this.setState({ loading: false, error });
	},


	onBillingRejected (event) {
		const errors = Object.assign({}, this.state.errors || {});
		const {response} = event;
		const {error} = response;
		let {param: key} = error || {};

		if (/^exp_/i.test(key)) {
			key = 'exp_';
		}

		errors[key] = error;

		this.setState({ errors, busy: false });

		console.log(event);
	},


	onLockSubmit () {
		this.setState({ submitEnabled: false });
	},


	onUnlockSubmit () {
		this.setState({ submitEnabled: true });
	},


	getValues  () {
		let i, v;
		const {refs} = this;
		const result = Object.assign({}, this.state.initialValues);

		for (i in refs) {
			if (!refs.hasOwnProperty(i)) { continue; }

			v = refs[i];

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
			Actions.verifyBillingInfo(stripeKey, this.getValues());
		}
	},


	validate () {
		const errors = {};
		const {recipient, from, card, billing} = this.refs;

		if (!card.validate(false)) {
			errors.card = {message: 'Please correct the errors above.'};
		}

		if (!billing.validate()) {
			errors.billing = {message: 'Please correct the errors above.'};
		}

		if (!from.validate()) {
			errors.from = {message: 'Please correct the errors above.'};
		}

		if (!recipient.isValid()) {
			errors.required = { message: t('incompleteForm') };
			errors.recipient = recipient.isEmpty()
				? {error: t('requiredField')}
				: {message: t('invalidRecipient')};
		}

		this.setState({ errors });

		return Object.keys(errors).length === 0;
	},


	render () {
		const {props: {purchasable}, state: {agreed, error, errors, initialValues, loading, submitEnabled}} = this;
		let enabled = (agreed && submitEnabled);
		let submitCls = enabled ? '' : 'disabled';

		if(loading) {
			return <Loading />;
		}

		if(error) {
			return <Err error={error} />;
		}

		return (
			<div className="gift enrollment">
				<Pricing ref="Pricing" purchasable={purchasable} />

				<FormPanel title={tGift('PAYMENT.title')} subhead={tGift('PAYMENT.sub')} styled={false}>
					<From ref="from" initialValues={initialValues} />
					<CreditCardForm ref="card" initialValues={initialValues} className="payment-fields"/>
					<BillingAddressForm ref="billing" initialValues={initialValues} className="payment-fields"/>
				</FormPanel>

				<Header />
				<Recipient ref="recipient" />

				<FormErrors errors={errors}/>

				<div className="agreement">
					<label>
						<input type="checkbox" name="agree" checked={agreed} onChange={this.onAgreementCheckedChange}/>
						<Localized tag="span" stringId="ENROLLMENT.GIFT.agreeToTerms" url={agreementURL} />
					</label>
				</div>

				<div className="button-row">
					<button
						disabled={!enabled}
						className={submitCls}
						onClick={this.onClick}>
						{tGift('purchaseButton')}
					</button>
				</div>
			</div>
		);
	}
});
