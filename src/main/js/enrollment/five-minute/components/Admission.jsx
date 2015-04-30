import React from 'react';

import getLinkFn from 'nti.lib.interfaces/utils/getlink';

import Loading from 'common/components/Loading';
import Err from 'common/components/Error';
import PanelButton from 'common/components/PanelButton';

import Redirect from 'navigation/components/Redirect';

import FiveMinuteEnrollmentForm from './FiveMinuteEnrollmentForm';

import Payment from './Payment';

import Store from '../Store';
import * as Constants from '../Constants';

import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT');

function getLink(o, k) {
	console.error('Object should be a model and then use the getLink method off of it. %o', o);
	return getLinkFn(o, k);
}

export default React.createClass({

	getInitialState () {
		return {
			loading: true,
			admissionStatus: null
		};
	},

	componentDidMount () {
		Store.getAdmissionStatus().then(status=> this.setState({
				admissionStatus: status ? status.toUpperCase() : Constants.ADMISSION_NONE,
				loading: false
			}),
			reason => {
				console.error('unable to fetch admission status:', reason);
				this.setState({
					loading: false,
					error: reason
				});
			});
		Store.addChangeListener(this.onStoreChange);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	},

	onStoreChange (event) {

		if (event.isError) {
			this.setState({
				loading: false
			});
		}

		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.ADMISSION_SUCCESS:
				let payAndEnrollLink = getLink(event.response, Constants.PAY_AND_ENROLL);
				this.setState({
					admissionStatus: event.response.State,
					payAndEnrollLink: payAndEnrollLink
				});
				break;

			case Constants.RECEIVED_PAY_AND_ENROLL_LINK:
				this.setState({
					redirect: event.response.href
				});
				break;
		}
	},

	render () {

		if (this.state.error) {
			return <Err error={this.state.error} />;
		}

		if (this.state.loading) {
			return <Loading />;
		}

		if (this.state.redirect) {
			return <Redirect location={this.state.redirect} force={true} />;
		}

		let view;

		switch((this.state.admissionStatus || '').toUpperCase()) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.ADMISSION_ADMITTED:
				let enrollment = this.props.enrollment;
				let link = this.state.payAndEnrollLink || getLink(enrollment, Constants.PAY_AND_ENROLL);
				let crn = enrollment.NTI_CRN;
				// ignore jshint on the following line because we know NTI_Term
				// is not not camel cased; that's what we get from dataserver.
				let term = this.props.enrollment.NTI_Term; // jshint ignore:line

				view = link ? (
					<Payment paymentLink={link} ntiCrn={crn} ntiTerm={term}/>
				) : (
					<PanelButton href="../" linkText="Go Back" className="error">
						<p>Unable to direct to payment site. Please try again later.</p>
					</PanelButton>
				);
				break;

			case Constants.ADMISSION_REJECTED:
			case Constants.ADMISSION_NONE:
				view = <FiveMinuteEnrollmentForm />;
				break;

			case Constants.ADMISSION_PENDING:
				view = <PanelButton href="http://google.com">{t('admissionPendingMessage')}</PanelButton>;
				break;

			default:
				view = <div className='error'>Unrecognized admission state: {this.state.admissionStatus}</div>;
		}

		return view;
	}

});
