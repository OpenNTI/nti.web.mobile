/* global jQuery, Stripe */

import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import isEmail from 'nti.lib.interfaces/utils/isemail';

import {scoped} from 'common/locale';

let _t = scoped('ENROLLMENT.GIFT');
let t = scoped('ENROLLMENT.forms.storeenrollment');
let t2 = scoped('ENROLLMENT');

import Recipient from './GiftRecipient';
import Pricing from './Pricing';

import fieldConfig from '../configs/GiftPaymentForm.js';

import Loading from 'common/components/Loading';
import RenderFormConfigMixin from 'common/forms/mixins/RenderFormConfigMixin';
import FormattedPriceMixin from 'enrollment/mixins/FormattedPriceMixin';
import FormPanel from 'common/forms/components/FormPanel';
import Localized from 'common/components/LocalizedHTML';
import ScriptInjector from 'common/mixins/ScriptInjectorMixin';
import Err from 'common/components/Error';

import Actions from '../Actions';
import Store from '../Store';
import Constants from '../Constants';

let agreementURL = '/mobile/api/user-agreement/view';

let Header = React.createClass({

	displayName: 'GiftView:Header',

	render: function() {
		return (
			<div>
				<h2>{_t('HEADER.title')}</h2>
				<p>{_t('HEADER.description')}</p>
			</div>
		);
	}
});

module.exports = React.createClass({
	displayName: 'GiftView',

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
			agreed: false,
			loading: true,
			fieldValues: formData,
			submitEnabled: true,
			errors: {}
		};
	},

	componentDidMount: function() {
		Promise.all([
			this.injectScript('https://code.jquery.com/jquery-2.1.3.min.js', 'jQuery'),
			this.injectScript('https://js.stripe.com/v2/', 'Stripe'),
			this.injectScript('//cdnjs.cloudflare.com/ajax/libs/jquery.payment/1.0.2/jquery.payment.min.js', 'jQuery.payment')
		])
		.then(
			function() {
				this.setState({
					loading: false
				});
			}.bind(this),
			function(reason) {
				this.setState({
					loading: false,
					error: reason
				});
			}.bind(this));

		Store.addChangeListener(this._onChange);

		this.addFormatters();
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},


	_onChange: function(event) {
		var errors = this.state.error || {};
		var key;

		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.BILLING_INFO_REJECTED:
				key = event.response.error.param;

				if (/^exp_/i.test(key)) {
					key = 'exp_';
				}

				errors[key] = event.response.error;
				this.setState({
					errors: errors,
					busy: false
				});
				console.log(event);
				break;

			case Constants.LOCK_SUBMIT:
				this.setState({
					submitEnabled: false
				});
				break;

			case Constants.UNLOCK_SUBMIT:
				this.setState({
					submitEnabled: true
				});
				break;
		}
	},


	componentDidUpdate: function() {
		this.addFormatters();
	},


	inputFormatters: {
		number: function(dom) {
			var jDom = jQuery(dom);

			if (jDom && jDom.payment && !dom.hasFormatter) {
				jDom.payment('formatCardNumber');
				dom.hasFormatter = true;
			}
		},
		exp_: function(dom) {
			var jDom = jQuery(dom);

			if (jDom && jDom.payment && !dom.hasFormatter) {
				jDom.payment('formatCardExpiry');
				dom.hasFormatter = true;
			}
		},
		cvc: function(dom) {
			var jDom = jQuery(dom);

			if (jDom && jDom.payment && !dom.hasFormatter) {
				jDom.payment('formatCardCVC');
				dom.hasFormatter = true;
			}
		}
	},


	outputFormatters: {
		exp_: function(dom) {
			var jDom = jQuery(dom);
			var result = {};

			if (jDom && jDom.payment) {
				result = jDom.payment('cardExpiryVal');

				return {
					//External API... ignore names
					exp_month: result.month, // eslint-disable-line camelcase
					exp_year: result.year // eslint-disable-line camelcase
				};
			}

			return result;
		}
	},


	getFormData: function () {
		var i, refs = this.refs,
			v, result = Object.assign({}, this.state.fieldValues);

		for (i in refs) {
			if (!refs.hasOwnProperty(i)) { continue; }

			v = refs[i];

			if (v.getData) {
				Object.assign(result, v.getData());

			} else if (this.outputFormatters[i]) {
				Object.assign(result, this.outputFormatters[i](v.getDOMNode()));
			}

		}

		return result;
	},


	_onAgreementCheckedChange: function (e) {
		var result = this.getFormData();

		this.setState({
			agreed: e.target.checked
		});

		this._validate(result);
	},


	_onClick: function() {
		var stripeKey = this.props.purchasable.StripeConnectKey.PublicKey;
		var result = this.getFormData();

		if (this._validate(result) && this.state.agreed) {
			Actions.verifyBillingInfo(stripeKey, result);
		}
	},


	_validate: function(fieldValues) {
		var errors = {};

		function markRequired(ref) {
			errors[ref] = {
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

		fieldConfig.forEach(function(fieldset) {
			fieldset.fields.forEach(function(field) {
				var value = (fieldValues[field.ref]||'').trim();
				if (value.length === 0) {
					if (field.required) {
						markRequired(field.ref);
					}
				}
				else {

					if (field.type === 'email' && !isEmail(value)) {
						errors[field.ref] = {
							message: t2('invalidEmail'),
							error: 'not an email address'
						};
					}

				}


			});
		});

		if (!this.refs.Recipient.isValid()) {
			if (this.refs.Recipient.isEmpty()) {
				markRequired('Recipient');
			} else {
				errors.Recipient = {message: t2('invalidRecipient')};
			}
		}

		let number = (fieldValues.number||'');
		if(number.trim().length > 0 && !Stripe.card.validateCardNumber(number)) {
			errors.number = {message: t2('invalidCardNumber')};
		}

		let cvc = (fieldValues.cvc||'');
		if(cvc.trim().length > 0 && !Stripe.card.validateCVC(cvc)) {
			errors.cvc = {message: t2('invalidCVC')};
		}
		/* jshint -W106 */
		let mon = (fieldValues.exp_month||'');
		let year = (fieldValues.exp_year||'');

		if([mon, year].join('').trim().length > 0 && !Stripe.card.validateExpiry(mon, year)) {
			errors.exp_month = {message: t2('invalidExpiration')}; // eslint-disable-line camelcase
			// no message property because we don't want the error message repeated
			errors.exp_year = {error: t2('invalidExpiration')}; // eslint-disable-line camelcase
			// since these two are combined in one input set an error on that field name
			// so the input can show the error
			errors.exp_ = {error: t2('invalidExpiration')}; // eslint-disable-line camelcase
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



	render: function() {
		let enabled = (this.state.agreed && this.state.submitEnabled);
		let submitCls = enabled ? '' : 'disabled';

		if(this.state.loading) {
			return <Loading />;
		}

		if(this.state.error) {
			return <Err error={this.state.error} />;
		}


		return (
			<div className="gift enrollment">
				<Pricing ref="Pricing" purchasable={this.props.purchasable} />

				<FormPanel title={_t('PAYMENT.title')} subhead={_t('PAYMENT.sub')} styled={false}>
					{this.renderFormConfig(fieldConfig, this.state.fieldValues, t)}
				</FormPanel>

				<Header />
				<Recipient ref="Recipient" />

				<div className="errors">
					<ReactCSSTransitionGroup transitionName="messages">
					{Object.keys(this.state.errors).map(ref => {
						let err = this.state.errors[ref];
						return (err.message ? <small key={ref} className='error'>{err.message}</small> : null);
					})}
					</ReactCSSTransitionGroup>
				</div>

				<div className="agreement">
					<label>
						<input type="checkbox" name="agree" checked={this.state.agreed} onChange={this._onAgreementCheckedChange}/>
						<Localized tag="span" stringId="ENROLLMENT.GIFT.agreeToTerms" url={agreementURL} />
					</label>
				</div>

				<div className="button-row">
					{/*<a ref="cancelButton">{_t('cancelPurchaseButton')}</a>*/}
					<button disabled={!enabled} className={submitCls} onClick={this._onClick}>{_t('purchaseButton')}</button>
				</div>
			</div>
		);
	}
});
