/* global jQuery, Stripe */

import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import isEmail from 'nti.lib.interfaces/utils/isemail';

import {scoped} from 'common/locale';
import {getAppUser} from 'common/utils';
import {clearLoadingFlag} from 'common/utils/react-state';

let t = scoped('ENROLLMENT');
let tGift = scoped('ENROLLMENT.GIFT');
let tForm = scoped('ENROLLMENT.forms.storeenrollment');

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

import Store from '../Store';
import * as Actions from '../Actions';
import * as Constants from '../Constants';
import Header from './GiftViewHeader';

let agreementURL = '/mobile/api/user-agreement/view';


export default React.createClass({
	displayName: 'GiftView',

	mixins: [RenderFormConfigMixin, ScriptInjector, FormattedPriceMixin],

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

	componentWillMount() {
		let fieldValues = Object.assign({}, Store.getPaymentFormData());

		getAppUser()
			.then(u => {
				let o = {};
				let current = this.state.fieldValues || {};

				if (!current.from) {
					o.from = u.email;
				}

				if (!current.name) {
					o.name = u.realname;
				}

				if (Object.keys(o).length) {
					fieldValues = Object.assign(o, fieldValues);
					this.setState({ fieldValues });
				}
			});

		this.setState({ fieldValues });
	},

	componentDidMount () {

		this.injectScript('https://code.jquery.com/jquery-2.1.3.min.js', 'jQuery')
			.then(() => this.injectScript('https://js.stripe.com/v2/', 'Stripe'))
			.then(() => this.injectScript('//cdnjs.cloudflare.com/ajax/libs/jquery.payment/1.0.2/jquery.payment.min.js', 'jQuery.payment'))
			.then(()=> clearLoadingFlag(this))
			.catch(this.onError);

		Store.addChangeListener(this.onChange);

		this.addFormatters();
	},


	componentWillUnmount () {
		Store.removeChangeListener(this.onChange);
	},


	onError (error) {
		this.setState({ loading: false, error });
	},


	onChange (event) {
		let errors = this.state.error || {};
		let key;

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


	componentDidUpdate () {
		this.addFormatters();
	},


	inputFormatters: {
		number (dom) {
			let jDom = jQuery(dom);

			if (jDom && jDom.payment && !dom.hasFormatter) {
				jDom.payment('formatCardNumber');
				dom.hasFormatter = true;
			}
		},
		exp_ (dom) {
			let jDom = jQuery(dom);

			if (jDom && jDom.payment && !dom.hasFormatter) {
				jDom.payment('formatCardExpiry');
				dom.hasFormatter = true;
			}
		},
		cvc (dom) {
			let jDom = jQuery(dom);

			if (jDom && jDom.payment && !dom.hasFormatter) {
				jDom.payment('formatCardCVC');
				dom.hasFormatter = true;
			}
		}
	},


	outputFormatters: {
		exp_ (dom) {
			let jDom = jQuery(dom);
			let result = {};

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


	getFormData  () {
		let i, refs = this.refs,
			v, result = Object.assign({}, this.state.fieldValues);

		for (i in refs) {
			if (!refs.hasOwnProperty(i)) { continue; }

			v = refs[i];

			if (v.getData) {
				Object.assign(result, v.getData());

			} else if (this.outputFormatters[i]) {
				Object.assign(result, this.outputFormatters[i](React.findDOMNode(v)));
			}

		}

		return result;
	},


	onAgreementCheckedChange  (e) {
		let result = this.getFormData();

		this.setState({
			agreed: e.target.checked
		});

		this.validate(result);
	},


	onClick () {
		let stripeKey = this.props.purchasable.getStripeConnectKey().PublicKey;
		let result = this.getFormData();

		if (this.validate(result) && this.state.agreed) {
			Actions.verifyBillingInfo(stripeKey, result);
		}
	},


	validate (fieldValues) {
		let errors = {};

		function markRequired(ref) {
			errors[ref] = {
				// no message property because we don'tForm want the 'required' message
				// repeated for every required field...

				// ...but we still want an entry for this ref so the field gets flagged
				// as invalid.
				error: t('requiredField')
			};
			errors.required = {
				message: t('incompleteForm')
			};
		}

		fieldConfig.forEach(function(fieldset) {
			fieldset.fields.forEach(function(field) {
				let value = (fieldValues[field.ref]||'').trim();
				if (value.length === 0) {
					if (field.required) {
						markRequired(field.ref);
					}
				}
				else {

					if (field.type === 'email' && !isEmail(value)) {
						errors[field.ref] = {
							message: t('invalidEmail'),
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
				errors.Recipient = {message: t('invalidRecipient')};
			}
		}

		let number = (fieldValues.number||'');
		if(number.trim().length > 0 && !Stripe.card.validateCardNumber(number)) {
			errors.number = {message: t('invalidCardNumber')};
		}

		let cvc = (fieldValues.cvc||'');
		if(cvc.trim().length > 0 && !Stripe.card.validateCVC(cvc)) {
			errors.cvc = {message: t('invalidCVC')};
		}

		let mon = (fieldValues.exp_month||'');
		let year = (fieldValues.exp_year||'');

		if([mon, year].join('').trim().length > 0 && !Stripe.card.validateExpiry(mon, year)) {
			errors.exp_month = {message: t('invalidExpiration')}; // eslint-disable-line camelcase
			// no message property because we don'tForm want the error message repeated
			errors.exp_year = {error: t('invalidExpiration')}; // eslint-disable-line camelcase
			// since these two are combined in one input set an error on that field name
			// so the input can show the error
			errors.exp_ = {error: t('invalidExpiration')}; // eslint-disable-line
		}

		this.setState({
			errors: errors
		});

		return Object.keys(errors).length === 0;
	},


	_inputBlurred (/*event*/) {
		let errs = this.state.errors;
		if(Object.keys(errs).length === 1 && errs.hasOwnProperty('required')) {
			this.setState({
				errors: {}
			});
		}
	},



	render () {
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

				<FormPanel title={tGift('PAYMENT.title')} subhead={tGift('PAYMENT.sub')} styled={false}>
					{this.renderFormConfig(fieldConfig, this.state.fieldValues, tForm)}
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
						<input type="checkbox" name="agree" checked={this.state.agreed} onChange={this.onAgreementCheckedChange}/>
						<Localized tag="span" stringId="ENROLLMENT.GIFT.agreeToTerms" url={agreementURL} />
					</label>
				</div>

				<div className="button-row">
					{/*<a ref="cancelButton">{tGift('cancelPurchaseButton')}</a>*/}
					<button disabled={!enabled} className={submitCls} onClick={this.onClick}>{tGift('purchaseButton')}</button>
				</div>
			</div>
		);
	}
});
