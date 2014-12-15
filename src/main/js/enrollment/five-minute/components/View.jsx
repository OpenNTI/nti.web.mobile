/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Loading = require('common/components/Loading');
var Err = require('common/components/Error');
var PanelButton = require('common/components/PanelButton');
var FiveMinuteEnrollmentForm = require('./FiveMinuteEnrollmentForm');
var Payment = require('./Payment');
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
				var link = getLink(event.response.Links, 'fmaep.pay.and.enroll');
				if (!link) {
					this.setState(
						{
							error: {
								message: 'Unable to direct you to payment. Please try again later.'
							}
						});
				}
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
				var crn = this.props.enrollment.NTI_CRN;
				// ignore jshint on the following line because we know NTI_Term
				// is not not camel cased; that's what we get from dataserver.
				var term = this.props.enrollment.NTI_Term; // jshint ignore:line 
				view = <Payment paymentLink={this.state.paymentLink} ntiCrn={crn} ntiTerm={term}/>;
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
