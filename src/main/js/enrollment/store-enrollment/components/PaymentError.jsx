/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var Store = require('../Store');

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

	render: function() {

		return (
			<div className="small-12 columns">
				<PanelButton className="error" href='../../../'>
					<p>We were unable to process your enrollment for '{this.props.courseTitle}'.</p>
					{this.errorMessage()}
					<p>Please try again. If this issue persists contact support.</p>
				</PanelButton>
			</div>
		);
	}

});

module.exports = PaymentError;
