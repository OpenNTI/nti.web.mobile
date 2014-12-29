'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var Store = require('../Store');
var Actions = require('../Actions');

var PaymentError = React.createClass({

	mixins: [NavigatableMixin],

	getInitialState: function() {
		return {};
	},

	componentWillMount: function() {
		var error = (Store.getPaymentResult()||{}).Error;
		var message = (error||{}).Message;
		if (message) {
			this.setState({
				message: message
			});
		}
	},

	errorMessage: function() {
		return this.state.message ? <p>{this.state.message}</p> : null;
	},

	_buttonClick: function() {
		Actions.resetProcess({
			gift: !!this.props.isGift
		});
	},

	render: function() {

		var courseTitle = this.props.courseTitle;

		return (
			<div className="small-12 columns">
				<PanelButton className="error" buttonClick={this._buttonClick}>
					<p>We were unable to process your enrollment for '{courseTitle}'.</p>
					{this.errorMessage()}
					<p>If this issue persists contact support.</p>
				</PanelButton>
			</div>
		);
	}

});

module.exports = PaymentError;
