'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var t = require('common/locale').scoped('ENROLLMENT');
var Actions = require('../Actions');
var Err = require('common/components/Error');
var Loading = require('common/components/Loading');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var Store = require('../Store');
var Constants = require('../Constants');


var Payment = React.createClass({

	mixins: [NavigatableMixin],

	propTypes: {
		paymentLink: React.PropTypes.string.isRequired, // dataserver pay and enroll link ('fmaep.pay.and.enroll')
		ntiCrn: React.PropTypes.string.isRequired, // passed to dataserver to get payment site url
		ntiTerm: React.PropTypes.string.isRequired // passed to dataserver to get payment site url
	},

	getInitialState: function() {
		return {
			loading: false
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChange);
	},

	_storeChange: function(event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.errors.PAY_AND_ENROLL_ERROR:
				this.setState({
					loading: false,
					error: event
				});
				break;
		}
	},

	buttonClick: function(event) {
		event.preventDefault();
		this.setState({
			loading: true
		});
		Actions.doExternalPayment({
			link: this.props.paymentLink,
			ntiCrn: this.props.ntiCrn,
			ntiTerm: this.props.ntiTerm,
			returnUrl: this.makeHref('/paymentcomplete/')
		});
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		if (this.state.error) {
			return <Err error={this.state.error} />;
		}

		return (
			<PanelButton
				buttonClick={this.buttonClick}
				linkText={t("proceedToPayment")}>
					<span>You will be taken to a secure external site for payment.</span>
			</PanelButton>
		);
	}

});

module.exports = Payment;
