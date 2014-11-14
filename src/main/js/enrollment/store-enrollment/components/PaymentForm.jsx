/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var RenderFieldConfigMixin = require('common/components/forms/mixins/RenderFieldConfigMixin');
var t = require('common/locale').scoped('ENROLLMENT.forms.storeenrollment');
var ScriptInjector = require('common/mixins/ScriptInjectorMixin');
var Loading = require('common/components/Loading');
var Actions = require('../Actions');
var Store = require('../Store');
var Constants = require('../Constants');
var _fieldConfig = require('./paymentFormConfig');
var FormattedPriceMixin = require('enrollment/mixins/FormattedPriceMixin');

var Form = React.createClass({

	mixins: [RenderFieldConfigMixin,ScriptInjector,FormattedPriceMixin],

	propTypes: {
		purchasable: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			loading: true,
			fieldValues: {},
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
			// case Constants.BILLING_INFO_VERIFIED:
			// 	this.setState({
			// 		busy: false,
			// 		stripeToken: event.response
			// 	});
			// break;

			case Constants.BILLING_INFO_REJECTED:
				var errors = this.state.errors||{};
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
		var errors = {};
		var fieldValues = this.state.fieldValues||{};
		_fieldConfig.forEach(function(field) {
			if (field.required) {
				var value = (fieldValues[field.ref]||'');
				if (value.trim().length === 0) {
					errors[field.ref] = {
						// no message property because we don't want the 'required' message
						// repeated for every required field...

						// ...but we still want an entry for this ref so the field gets flagged
						// as invalid.
						error: 'Field is required'
					};
					errors.required = {
						message: 'Please complete all required fields.'
					};
				}
			}
		});
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

	_handleSubmit: function(event) {
		event.preventDefault();

		if(!this._validate()) {
			return;
		}

		this.setState({
			busy: true
		});

		var stripeKey = this.props.purchasable.StripeConnectKey.PublicKey;
		Actions.verifyBillingInfo(stripeKey, this.state.fieldValues);
	},

	render: function() {

		if(this.state.loading) {
			return <Loading />;
		}

		var purch = this.props.purchasable;
		var price = this.getFormattedPrice(purch.Currency, purch.Amount);
		var fieldRenderFn = this.renderField.bind(null,t,this.state.fieldValues);
		var title = purch.Name||null;
		var state = this.state;
		var cssClasses = ['row'];

		if(this.state.busy) {
			cssClasses.push('busy');
		}

		return (
			<div className={cssClasses.join(' ')}>
				<form className="store-enrollment-form medium-6 medium-centered columns" onSubmit={this._handleSubmit}>
					<div className="column">
						<h2>{title}</h2>
						<p>Enroll as a Lifetime Learner: {price}</p>
					</div>
					
					<fieldset>
						<legend>Billing Information</legend>
						{_fieldConfig.map(fieldRenderFn)}
						<div className='errors'>
							<ReactCSSTransitionGroup transitionName="messages">
								{Object.keys(state.errors).map(
									function(ref) {
										var err = state.errors[ref];
										return (err.message ? <small key={ref} className='error'>{err.message}</small> : null);
								})}
							</ReactCSSTransitionGroup>
						</div>
						<input type="submit"
							id="storeenroll:submit"
							className="small-12 columns tiny button radius"
							value="Continue" />
					</fieldset>
				</form>
			</div>
		);
	}

});

module.exports = Form;
