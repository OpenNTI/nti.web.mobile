import React from 'react';

import getLinkFn from 'nti.lib.interfaces/utils/getlink';

import Loading from 'common/components/Loading';
import Err from 'common/components/Error';

import Redirect from 'navigation/components/Redirect';

import FiveMinuteEnrollmentForm from './FiveMinuteEnrollmentForm';

import Payment from './Payment';

import Store from '../Store';
import * as Constants from '../Constants';

import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT');
const tt = scoped('BUTTONS');

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
		this.getAdmissionStatus();

		Store.addChangeListener(this.onStoreChange);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	},


	getAdmissionStatus () {
		Store.getAdmissionStatus()

			.then(

				status=> this.setState({
					admissionStatus: status ? status.toUpperCase() : Constants.ADMISSION_NONE,
					loading: false
				}),

				error => {
					console.error('unable to fetch admission status:', error);
					this.setState({ loading: false, error });
				}
			);
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
					admissionStatus: event.response.State,//what is event.response?
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


	componentDidUpdate (prevProps, prevState) {
		if (this.state.admissionStatus !== prevState.admissionStatus) {
			global.scrollTo(0, 0);
		}
	},


	render () {
		//TODO: Rewrite into a router (memory env) or some other "select" style to split this into smaller, clearer render methods/components.

		if (this.state.error) {
			return <Err error="There was a problem on the backend. Please try again later."/>;
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
				// ignore eslint on the following line because we know NTI_Term
				// is not not camel cased; that's what we get from dataserver.
				let term = this.props.enrollment.NTI_Term;

				view = link ? (
					<Payment paymentLink={link} ntiCrn={crn} ntiTerm={term}/>
				) :
					this.renderPanel('Unable to direct to payment site. Please try again later.', 'Go Back', 'error');
				break;

			case Constants.ADMISSION_REJECTED:
			case Constants.ADMISSION_NONE:
				view = <FiveMinuteEnrollmentForm />;
				break;

			case Constants.ADMISSION_PENDING:
				view = this.renderPanel(t('admissionPendingMessage'), tt('ok'));
				break;

			default:
				view = <div className='error'>Unrecognized admission state: {this.state.admissionStatus}</div>;
		}

		return view;
	},



	renderPanel (message, buttonLabel, cls = '') {
		return (
			<div className={'enrollment-admission ' + cls}>
				<figure className="notice">
					<div>{message}</div>
				</figure>
				<a className="button tiny" href="../">{buttonLabel}</a>
			</div>
		);
	}

});
