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

var Form = React.createClass({

	mixins: [RenderFieldConfigMixin,ScriptInjector],

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
			case Constants.VERIFY_BILLING_INFO:
				if (event.status === 402 || event.response.error) {
					var errors = this.state.errors||{};
					errors[event.response.param] = event.response.error;
					this.setState({
						errors: errors,
						busy: false
					});
				}
				console.log(event);
			break;
		}
	},

	_handleSubmit: function(event) {
		event.preventDefault();
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

		var fieldRenderFn = this.renderField.bind(null,t,this.state.fieldValues);
		var title = this.props.purchasable.Name||null;
		var state = this.state;
		var cssClasses = ['row'];
		if(this.state.busy) {
			cssClasses.push('busy');
		}

		return (
			<div className={cssClasses.join(' ')}>
				<div className="column"><h2>{title}</h2></div>
				<form className="store-enrollment-form medium-6 medium-centered columns" onSubmit={this._handleSubmit}>
					<fieldset>
						<legend>Payment Information</legend>
						{_fieldConfig.map(fieldRenderFn)}
						<div className='errors'>
							<ReactCSSTransitionGroup transitionName="messages">
								{Object.keys(state.errors).map(
									function(ref) {
										var err = state.errors[ref];
										console.debug(err);
										return (<small key={ref} className='error'>{err.message}</small>);
								})}
							</ReactCSSTransitionGroup>
						</div>
						<input type="submit"
							id="storeenroll:submit"
							className="small-12 columns tiny button radius"
							value="Continue to Enrollment" />
					</fieldset>
				</form>
			</div>
		);
	}

});

module.exports = Form;