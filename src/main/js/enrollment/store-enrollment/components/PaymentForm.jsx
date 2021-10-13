// tell eslint that Stripe is declared elsewhere
// we're naming fields to line up with the stripe api which uses lowercase
// with underscores (e.g. exp_month vs. expMonth) so don't enforce camel case
// in this file.
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { scoped } from '@nti/lib-locale';
import { Loading } from '@nti/web-commons';
import { ExternalLibraryManager, getAppUser } from '@nti/web-client';
import { StoreEventsMixin } from '@nti/lib-store';
import FormPanel from 'internal/forms/components/FormPanel';
import FormErrors from 'internal/forms/components/FormErrors';
import { clearLoadingFlag } from 'internal/common/utils/react-state';

import Store from '../Store';
import { verifyBillingInfo } from '../Actions';
import { BILLING_INFO_REJECTED } from '../Constants';

import BillingAddress from './BillingAddressForm';
import CreditCardForm from './CreditCardForm';
import TermsCheckbox from './TermsCheckbox';
import Pricing from './Pricing';

const t = scoped('enrollment.forms', {
	invalidForm: 'Please correct the errors above.',
});

export default createReactClass({
	displayName: 'PaymentForm',
	mixins: [StoreEventsMixin, ExternalLibraryManager],

	backingStore: Store,
	backingStoreEventHandlers: {
		[BILLING_INFO_REJECTED]: 'onBillingRejected',
	},

	propTypes: {
		purchasable: PropTypes.object.isRequired,
	},

	attachPricingRef(x) {
		this.pricing = x;
	},
	attachCardRef(x) {
		this.card = x;
	},
	attachBillingRef(x) {
		this.billing = x;
	},

	getInitialState() {
		return {
			loading: true,
		};
	},

	componentDidMount() {
		let defaultValues = { ...Store.getPaymentFormData() };

		const setDefaults = u => {
			let { defaultValues: current = {} } = this.state;
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
			//we don't use this, but we want to put up a splash "loading" for the library at a
			//higher level than the component that uses it.
			this.ensureExternalLibrary(['jquery.payment']),

			getAppUser().then(setDefaults),
		]).then(() => clearLoadingFlag(this));
	},

	onBillingRejected(event) {
		const errors = { ...(this.state.errors || {}) };
		const { response } = event;
		const { error } = response;

		errors[error.param] = error;

		// console.log(event);

		for (let ref of [this.pricing, this.card, this.billing]) {
			if (ref && ref.delegateError && ref.delegateError(errors)) {
				return this.setState({
					busy: false,
					errors: {
						general: { message: t('invalidForm') },
					},
				});
			}
		}

		this.setState({ errors, busy: false });
	},

	getValues() {
		const { pricing, billing } = this;
		return { ...billing.getValue(), ...pricing.getData() };
	},

	validate() {
		const errors = {};

		const { card, billing } = this;

		//We let each composit field to validate itself...and show errors on
		//their own fields. We just want to report that there were errors to
		//correct at the bottom. That is way each of these assign to the same
		//key on "errors". (the key name is irrelevant)

		if (!card.validate(false)) {
			errors.sub = { message: 'Please correct the errors above.' };
		}

		if (!billing.validate()) {
			errors.sub = { message: 'Please correct the errors above.' };
		}

		this.setState({ errors });
		return Object.keys(errors).length === 0;
	},

	handleSubmit(event) {
		event.preventDefault();

		if (!this.validate()) {
			return;
		}

		this.setState({ busy: true });

		let stripeKey = this.props.purchasable.getStripeConnectKey().PublicKey;

		verifyBillingInfo(stripeKey, this.getValues(), this.createToken);
	},

	termsCheckboxChange(termsChecked) {
		this.validate();
		this.setState({ termsChecked });
	},

	onCreditCardChange(createToken) {
		this.createToken = createToken;
	},

	render() {
		const {
			props: { purchasable: purch },
			state: { busy, errors, defaultValues, loading, termsChecked },
		} = this;

		if (loading) {
			return <Loading.Mask />;
		}

		const title = purch.name || null;

		return (
			<FormPanel
				onSubmit={this.handleSubmit}
				title={title}
				className="payment-form"
			>
				<Pricing ref={this.attachPricingRef} purchasable={purch} />
				<CreditCardForm
					purchasable={purch}
					defaultValues={defaultValues}
					ref={this.attachCardRef}
					onChange={this.onCreditCardChange}
				/>
				<BillingAddress
					defaultValues={defaultValues}
					ref={this.attachBillingRef}
				/>
				{errors && <FormErrors errors={errors} />}
				<TermsCheckbox onChange={this.termsCheckboxChange} />
				{busy ? (
					<div>
						<Loading.Ellipse />
					</div>
				) : (
					<input
						type="submit"
						id="storeenroll:submit"
						disabled={!termsChecked}
						className="small-12 columns tiny button radius"
						value="Continue"
					/>
				)}
			</FormPanel>
		);
	},
});
