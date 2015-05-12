// tell eslint that Stripe is declared elsewhere
/* global Stripe */

// we're naming fields to line up with the stripe api which uses lowercase
// with underscores (e.g. exp_month vs. expMonth) so don't enforce camel case
// in this file.

import React from 'react';
import RenderFormConfigMixin from 'common/forms/mixins/RenderFormConfigMixin';
import {scoped} from 'common/locale';

import FormPanel from 'common/forms/components/FormPanel';
import FormErrors from 'common/forms/components/FormErrors';

import Loading from 'common/components/Loading';
import {clearLoadingFlag} from 'common/utils/react-state';

import ScriptInjector from 'common/mixins/ScriptInjectorMixin';

import FormattedPriceMixin from 'enrollment/mixins/FormattedPriceMixin';

import Store from '../Store';
import {verifyBillingInfo} from '../Actions';
import {BILLING_INFO_REJECTED} from '../Constants';
import fieldConfig from '../configs/PaymentForm';

const t = scoped('ENROLLMENT.forms.storeenrollment');
const t2 = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'PaymentForm',
	mixins: [RenderFormConfigMixin, ScriptInjector, FormattedPriceMixin],

	propTypes: {
		purchasable: React.PropTypes.object.isRequired
	},

	getInitialState () {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Note: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)

		let formData = Store.getPaymentFormData();

		return {
			loading: true,
			fieldValues: formData,
			errors: {}
		};
	},

	componentDidMount () {
		this.injectScript('https://js.stripe.com/v2/', 'Stripe')
			.then(() => clearLoadingFlag(this));
		Store.addChangeListener(this.onStoreChange);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	},

	onStoreChange (event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case BILLING_INFO_REJECTED:
				let errors = this.state.errors||{};
				errors[event.response.error.param] = event.response.error;
				this.setState({
					errors: errors,
					busy: false
				});
				console.log(event);
			break;
		}
	},

	validate () {
		let errors = {};
		let fieldValues = this.state.fieldValues||{};
		fieldConfig.forEach(fieldset => {
			fieldset.fields.forEach(field => {
				if (field.required) {
					let value = (fieldValues[field.ref]||'');
					if (value.trim().length === 0) {
						errors[field.ref] = {
							// no message property because we don't want the 'required' message
							// repeated for every required field...

							// ...but we still want an entry for this ref so the field gets flagged
							// as invalid.
							error: t2('requiredField')
						};
						errors.required = {
							message: t2('incompleteForm')
						};
					}
				}
			});
		});

		let number = (this.state.fieldValues.number||'');
		if(number.trim().length > 0 && !Stripe.card.validateCardNumber(number)) {
			errors.number = {message: t2('invalidCardNumber')};
		}

		let cvc = (this.state.fieldValues.cvc||'');
		if(cvc.trim().length > 0 && !Stripe.card.validateCVC(cvc)) {
			errors.cvc = {message: t2('invalidCVC')};
		}

		let mon = (this.state.fieldValues.exp_month||'');
		let year = (this.state.fieldValues.exp_year||'');
		if([mon, year].join('').trim().length > 0 && !Stripe.card.validateExpiry(mon, year)) {
			errors.exp_month = {message: t2('invalidExpiration')}; // eslint-disable-line camelcase
			// no message property because we don't want the error message repeated
			errors.exp_year = {error: t2('invalidExpiration')}; // eslint-disable-line camelcase
		}

		this.setState({
			errors: errors
		});
		return Object.keys(errors).length === 0;
	},

	//XXX: not referenced?
	inputBlurred (/*event*/) {
		let errs = this.state.errors;
		if(Object.keys(errs).length === 1 && errs.hasOwnProperty('required')) {
			this.setState({
				errors: {}
			});
		}
	},


	handleSubmit (event) {
		event.preventDefault();

		if(!this.validate()) {
			return;
		}

		this.setState({
			busy: true
		});

		let stripeKey = this.props.purchasable.getStripeConnectKey().PublicKey;
		verifyBillingInfo(stripeKey, this.state.fieldValues);
	},

	render () {

		if(this.state.loading) {
			return <Loading />;
		}

		let purch = this.props.purchasable;
		let price = this.getFormattedPrice(purch.currency, purch.amount);
		let title = purch.name||null;
		let state = this.state;
		let cssClasses = ['row'];

		if(this.state.busy) {
			cssClasses.push('busy');
		}

		let subhead = t2('enrollAsLifelongLearnerWithPrice', {price: price});

		let fields = this.renderFormConfig(fieldConfig, state.fieldValues, t);

		return (
			<FormPanel onSubmit={this.handleSubmit} title={title} subhead={subhead}>
				{fields}
				<FormErrors errors={state.errors} />
				<input type="submit"
					key="submit"
					id="storeenroll:submit"
					className="small-12 columns tiny button radius"
					value="Continue" />
			</FormPanel>
		);
	}

});
