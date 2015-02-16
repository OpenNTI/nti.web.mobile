/* global jQuery, Stripe */
'use strict';

var React = require('react');
var ReactCSSTransitionGroup = require("react/lib/ReactCSSTransitionGroup");

var isEmail = require('dataserverinterface/utils/isemail');

var _t = require('common/locale').scoped('ENROLLMENT.GIFT');
var t = require('common/locale').scoped('ENROLLMENT.forms.storeenrollment');
var t2 = require('common/locale').scoped('ENROLLMENT');

var Recipient = require('./GiftRecipient');
var Pricing = require('./Pricing');

var fieldConfig = require('../configs/GiftPaymentForm.js');

var Loading = require('common/components/Loading');
var RenderFormConfigMixin = require('common/forms/mixins/RenderFormConfigMixin');
var FormattedPriceMixin = require('enrollment/mixins/FormattedPriceMixin');
var FormPanel = require('common/forms/components/FormPanel');
var Localized = require('common/components/LocalizedHTML');
var ScriptInjector = require('common/mixins/ScriptInjectorMixin');
var Err = require('common/components/Error');

var Actions = require('../Actions');
var Store = require('../Store');
var Constants = require('../Constants');

var agreementURL = '/mobile/api/user-agreement/view';

var Header = React.createClass({
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

	mixins: [RenderFormConfigMixin,ScriptInjector,FormattedPriceMixin],

	propTypes: {
		purchasable: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Node: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)

		var formData = Store.getPaymentFormData();

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
					/* jshint -W106 */
					exp_month: result.month,
					exp_year: result.year
					/* jshint +W106 */
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
				errors.Recipient =  {message: t2('invalidRecipient')};
			}
		}

		var number = (fieldValues.number||'');
		if(number.trim().length > 0 && !Stripe.card.validateCardNumber(number)) {
			errors.number =  {message: t2('invalidCardNumber')};
		}

		var cvc = (fieldValues.cvc||'');
		if(cvc.trim().length > 0 && !Stripe.card.validateCVC(cvc)) {
			errors.cvc =  {message: t2('invalidCVC')};
		}
		/* jshint -W106 */
		var mon = (fieldValues.exp_month||'');
		var year = (fieldValues.exp_year||'');

		if([mon,year].join('').trim().length > 0 && !Stripe.card.validateExpiry(mon,year)) {
			errors.exp_month =  {message: t2('invalidExpiration')};
			// no message property because we don't want the error message repeated
			errors.exp_year =  {error: t2('invalidExpiration')};
			// since these two are combined in one input set an error on that field name
			// so the input can show the error
			errors.exp_ = {error: t2('invalidExpiration')};
		}

		this.setState({
			errors: errors
		});

		return Object.keys(errors).length === 0;
	},


	_inputBlurred: function(/*event*/) {
		var errs = this.state.errors;
		if(Object.keys(errs).length === 1 && errs.hasOwnProperty('required')) {
			this.setState({
				errors: {}
			});
		}
	},



	render: function() {
		var enabled = (this.state.agreed && this.state.submitEnabled);
		var submitCls = enabled ? '' : 'disabled';

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
						var err = this.state.errors[ref];
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
