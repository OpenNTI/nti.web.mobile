

// tell jshint that Stripe is declared elsewhere
/* global Stripe: false */

// we're naming fields to line up with the stripe api which uses lowercase
// with underscores (e.g. exp_month vs. expMonth) so don't enforce camel case
// in this file.
/* jshint camelcase:false */

import React from 'react';
import RenderFormConfigMixin from 'common/forms/mixins/RenderFormConfigMixin';
import {scoped} from 'common/locale';
let t = scoped('ENROLLMENT.forms.storeenrollment');
let t2 = scoped('ENROLLMENT');

import ScriptInjector from 'common/mixins/ScriptInjectorMixin';
import Loading from 'common/components/Loading';

import Actions from '../Actions';
import Store from '../Store';
import Constants from '../Constants';
import _fieldConfig from '../configs/PaymentForm';
import FormattedPriceMixin from 'enrollment/mixins/FormattedPriceMixin';
import FormPanel from 'common/forms/components/FormPanel';
import FormErrors from 'common/forms/components/FormErrors';

export default React.createClass({

	mixins: [RenderFormConfigMixin, ScriptInjector, FormattedPriceMixin],

	propTypes: {
		purchasable: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Node: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)

		let formData = Store.getPaymentFormData();

		return {
			loading: true,
			fieldValues: formData,
			errors: {}
		};
	},

	componentDidMount: function() {
		this.injectScript('https://js.stripe.com/v2/', 'Stripe')
		.then(function() {
			this.setState({
				loading: false
			});
		}.bind(this));
		Store.addChangeListener(this._onStoreChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._onStoreChange);
	},

	_onStoreChange: function(event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.BILLING_INFO_REJECTED:
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

	_validate: function() {
		let errors = {};
		let fieldValues = this.state.fieldValues||{};
		_fieldConfig.forEach(function(fieldset) {
			fieldset.fields.forEach(function(field) {
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

	_inputBlurred: function(/*event*/) {
		let errs = this.state.errors;
		if(Object.keys(errs).length === 1 && errs.hasOwnProperty('required')) {
			this.setState({
				errors: {}
			});
		}
	},

	_handleSubmit: function(event) {
		event.preventDefault();

		if(!this._validate()) {
			return;
		}

		this.setState({
			busy: true
		});

		let stripeKey = this.props.purchasable.StripeConnectKey.PublicKey;
		Actions.verifyBillingInfo(stripeKey, this.state.fieldValues);
	},

	render: function() {

		if(this.state.loading) {
			return <Loading />;
		}

		let purch = this.props.purchasable;
		let price = this.getFormattedPrice(purch.Currency, purch.Amount);
		let title = purch.Name||null;
		let state = this.state;
		let cssClasses = ['row'];

		if(this.state.busy) {
			cssClasses.push('busy');
		}

		let subhead = t2('enrollAsLifelongLearnerWithPrice', {price: price});

		let fields = this.renderFormConfig(_fieldConfig, state.fieldValues, t);

		return (
			<FormPanel onSubmit={this._handleSubmit} title={title} subhead={subhead}>
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

