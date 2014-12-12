/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Loading = require('common/components/Loading');
var Err = require('common/components/Error');
var PanelButton = require('common/components/PanelButton');
var FiveMinuteEnrollmentForm = require('./FiveMinuteEnrollmentForm');
var Constants = require('../Constants');
var Store = require('../Store');
var StatusConstants = Constants.admissionStatus;
var t = require('common/locale').scoped('ENROLLMENT');
var getLink = require('dataserverinterface/utils/getlink');

var View = React.createClass({

	getInitialState: function() {
		return {
			loading: true,
			admissionStatus: null
		};
	},

	componentDidMount: function() {
		Store.getAdmissionStatus().then(function(status) {
			this.setState({
				admissionStatus: status ? status.toUpperCase() : status,
				loading: false
			});
		}.bind(this), function(reason) {
			console.error('unable to fetch admission status:', reason);
			this.setState({
				loading: false,
				error: reason
			});
		});
		Store.addChangeListener(this._storeChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChange);
	},

	_storeChange: function(event) {
		switch(event.type) {
			case Constants.events.ADMISSION_SUCCESS:
				// FIXME: paymentLink is the dataserver url. what's the flow to get from
				// here to the payment site? a click on the button pings the dataserver
				// to get the external payment site url?
				var link = getLink(event.response.Links, 'fmaep.pay.and.enroll');
				this.setState({
					admissionStatus: event.response.State,
					paymentLink: link 
				});
				break;
		}
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		if (this.state.error) {
			return <Err error={this.state.error} />;
		}

		var view;

		switch(this.state.admissionStatus) {
			case StatusConstants.ADMITTED:
				// FIXME: paymentLink as it's set up right now is the dataserver url.
				view = <PanelButton href={this.state.paymentLink} linkText={t("Proceed to payment")}>You will be taken to an external site for payment.</PanelButton>;
				break;

			case StatusConstants.REJECTED:
			case null:
				view = <FiveMinuteEnrollmentForm />;
				break;

			case StatusConstants.PENDING:
				view = <PanelButton href="http://google.com">{t('admissionPendingMessage')}</PanelButton>;
				break;

			default:
				view = <div className='error'>Unrecognized admission state: {this.state.admissionStatus}</div>;
		}

		return view;
	}

});

module.exports = View;
