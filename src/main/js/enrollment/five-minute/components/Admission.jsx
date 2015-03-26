'use strict';

var React = require('react');
var Loading = require('common/components/Loading');
var Redirect = require('navigation/components/Redirect');
var Err = require('common/components/Error');
var PanelButton = require('common/components/PanelButton');
var FiveMinuteEnrollmentForm = require('./FiveMinuteEnrollmentForm');
var Payment = require('./Payment');
var Constants = require('../Constants');
var Store = require('../Store');
var StatusConstants = Constants.admissionStatus;
var t = require('common/locale').scoped('ENROLLMENT');
var getLink = require('nti.lib.interfaces/utils/getlink');

module.exports = React.createClass({

	getInitialState: function() {
		return {
			loading: true,
			admissionStatus: null
		};
	},

	componentDidMount: function() {
		Store.getAdmissionStatus().then(function(status) {
			this.setState({
				admissionStatus: status ? status.toUpperCase() : StatusConstants.NONE,
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

		if (event.isError) {
			this.setState({
				loading: false
			});
		}

		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.events.ADMISSION_SUCCESS:
				var payAndEnrollLink = getLink(event.response, Constants.links.PAY_AND_ENROLL);
				this.setState({
					admissionStatus: event.response.State,
					payAndEnrollLink: payAndEnrollLink
				});
				break;

			case Constants.events.RECEIVED_PAY_AND_ENROLL_LINK:
				this.setState({
					redirect: event.response.href
				});
				break;
		}
	},

	render: function() {

		if (this.state.error) {
			return <Err error={this.state.error} />;
		}

		if (this.state.loading) {
			return <Loading />;
		}

		if (this.state.redirect) {
			return <Redirect location={this.state.redirect} force={true} />;
		}

		var view;

		switch((this.state.admissionStatus||'').toUpperCase()) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case StatusConstants.ADMITTED:
				var enrollment = this.props.enrollment;
				var link = this.state.payAndEnrollLink || getLink(enrollment, Constants.links.PAY_AND_ENROLL);
				var crn = enrollment.NTI_CRN;
				// ignore jshint on the following line because we know NTI_Term
				// is not not camel cased; that's what we get from dataserver.
				var term = this.props.enrollment.NTI_Term; // jshint ignore:line
				if (link) {
					view = <Payment paymentLink={link} ntiCrn={crn} ntiTerm={term}/>;
				}
				else {
					return (
						<PanelButton href="../" linkText="Go Back" className="error">
							<p>Unable to direct to payment site. Please try again later.</p>
						</PanelButton>
					);
				}

				break;

			case StatusConstants.REJECTED:
			case StatusConstants.NONE:
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
