/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var _t = require('common/locale').scoped('ENROLLMENT.GIFT');
var t = require('common/locale').scoped('ENROLLMENT.forms.storeenrollment');
var Recipient = require('./GiftRecipient');
var Pricing = require('./Pricing');
var _paymentFormCfg = require('./giftPaymentFormConfig.js');
var RenderFieldConfigMixin = require('common/components/forms/mixins/RenderFieldConfigMixin');
var FormattedPriceMixin = require('enrollment/mixins/FormattedPriceMixin');
var FormPanel = require('common/components/forms/FormPanel');
var ScriptInjector = require('common/mixins/ScriptInjectorMixin');
var Actions = require('../Actions');
var Store = require('../Store');
var Constants = require('../Constants');



var Header = React.createClass({
	render: function() {
		return (
			<div>
				<h1>{_t('HEADER.title')}</h1>
				<p>{_t('HEADER.description')}</p>
			</div>
		);
	}
});

module.exports = React.createClass({
	displayName: 'GiftView',

	mixins: [RenderFieldConfigMixin,ScriptInjector,FormattedPriceMixin],

	propTypes: {
		purchasable: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			formValues: {},
			submitEnabled: true,
		};
	},

	componentDidMount: function() {
		Promise.all([
			this.injectScript('https://js.stripe.com/v2/', 'Stripe'),
			this.injectScript('//cdnjs.cloudflare.com/ajax/libs/jquery.payment/1.0.2/jquery.payment.min.js', 'jQuery.payment')
		])
		.then(function() {
			this.setState({
				loading: false
			});
		}.bind(this));

		Store.addChangeListener(this._onChange);

		this.addFormatters();
	},


	componnentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},


	_onChange: function(e) {
		if (e.type === Constants.LOCK_SUBMIT) {
			this.setState({
				submitEnabled: false
			});
		} else if (e.type === Constants.UNLOCK_SUBMIT) {
			this.setState({
				submitEnabled: true
			});
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
					exp_month: result.month,
					exp_year: result.year
				};
			}

			return result;
		}
	},


	_onClick: function() {
		var i, refs = this.refs,
			v, result = {},
			stripeKey = this.props.purchasable.StripeConnectKey.PublicKey;

		for (i in refs) {
			if (!refs.hasOwnProperty(i)) { continue; }

			v = refs[i];

			if (v.getData) {
				Object.assign(result, v.getData());
			} else if (v.isMounted()) {
				v = v.getDOMNode();

				if (this.outputFormatters[i]) {
					Object.assign(result, this.outputFormatters[i](v));
				} else if (v.value) {
					result[i] = v.value;
				}
				
			} 
		}

		Actions.verifyBillingInfo(stripeKey, result);
	},


	render: function() {
		var submitCls = this.state.submitEnabled ? '' : 'disabled';

		return (
			<div>
				<Pricing ref="Pricing" purchasable={this.props.purchasable} />

				<FormPanel title= {_t('PAYMENT.title')} subhead={_t('PAYMENT.sub')}>
					{this.renderFormConfig(_paymentFormCfg, this.state.fieldValues, t)}
				</FormPanel>

				<Header />
				<Recipient ref="Recipient" />

				<a ref="cancelButton">Cancel</a>
				<button className={submitCls} onClick={this._onClick}>Click</button>
			</div>
		);
	}
});
