import React from 'react';

import Logger from 'nti-util-logger';
import getLinkFn from 'nti-lib-interfaces/lib/utils/getlink'; //Accessing interfaces/lib directly is taboo

import {Loading} from 'nti-web-commons';
import {Error as Err} from 'nti-web-commons';

import {StoreEventsMixin} from 'nti-lib-store';

import Redirect from 'navigation/components/Redirect';

import FiveMinuteEnrollmentForm from './FiveMinuteEnrollmentForm';

import Payment from './Payment';

import Store from '../Store';
import {
	ADMISSION_ADMITTED,
	ADMISSION_NONE,
	ADMISSION_PENDING,
	ADMISSION_REJECTED,
	ADMISSION_SUCCESS,
	PAY_AND_ENROLL,
	RECEIVED_PAY_AND_ENROLL_LINK
} from '../Constants';

import {scoped} from 'nti-lib-locale';

const logger = Logger.get('enrollment:five-minute:components:Admission');
const t = scoped('ENROLLMENT');
const tt = scoped('BUTTONS');

function getLink (o, k) {
	logger.error('Object should be a model and then use the getLink method off of it. %o', o);
	return getLinkFn(o, k);
}

export default React.createClass({
	displayName: 'Admission',
	mixins: [StoreEventsMixin],

	backingStore: Store,
	backingStoreEventHandlers: {

		[ADMISSION_SUCCESS] (event) {
			const {response} = event;
			const payAndEnrollLink = getLink(response, PAY_AND_ENROLL);
			this.setState({
				admissionStatus: response.State,//what is event.response?
				payAndEnrollLink
			});
		},

		[RECEIVED_PAY_AND_ENROLL_LINK] (event) {
			//this seems dirty... we should invoke the "redirect" outside of state...
			//the "navigation" should probably happen in the Action that dispatched this.
			this.setState({ redirect: event.response.href });
		},

		default (e) {
			if (e.isError) {
				this.setState({ loading: false });
			}
		}
	},

	propTypes: {
		enrollment: React.PropTypes.object
	},


	getInitialState () {
		return {
			loading: true,
			admissionStatus: null
		};
	},


	componentDidMount () {
		this.getAdmissionStatus();
	},


	getAdmissionStatus () {
		Store.getAdmissionStatus()
			.then(
				status=> this.setState({
					admissionStatus: status ? status.toUpperCase() : ADMISSION_NONE,
					loading: false
				}),

				error => {
					logger.error('unable to fetch admission status:', error);
					this.setState({ loading: false, error });
				}
			);
	},


	componentDidUpdate (prevProps, prevState) {
		if (this.state.admissionStatus !== prevState.admissionStatus) {
			global.scrollTo(0, 0);
		}
	},


	render () {
		//TODO: Rewrite into a router (memory env) or some other
		//"select" style to split this into smaller, clearer render methods/components.

		const {
			props: {
				enrollment
			},
			state: {
				error,
				loading,
				redirect,
				admissionStatus,
				payAndEnrollLink
			}
		} = this;

		if (error) {
			return <Err error="There was a problem on the backend. Please try again later."/>;
		}

		if (loading) {
			return <Loading />;
		}

		if (redirect) {
			//See comment above on the RECEIVED_PAY_AND_ENROLL_LINK handler
			return <Redirect location={redirect} force />;
		}

		let view;

		switch((admissionStatus || '').toUpperCase()) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
		case ADMISSION_ADMITTED: {
			let link = payAndEnrollLink || getLink(enrollment, PAY_AND_ENROLL);
			let crn = enrollment.NTI_CRN;
			// ignore eslint on the following line because we know NTI_Term
			// is not not camelCased; that's what we get from dataserver.
			let term = enrollment.NTI_Term;

			view = link ? (
				<Payment paymentLink={link} ntiCrn={crn} ntiTerm={term}/>
			) :
				this.renderPanel('Unable to direct to payment site. Please try again later.', 'Go Back', 'error');
			break;
		}
		case ADMISSION_REJECTED:
		case ADMISSION_NONE:
			view = <FiveMinuteEnrollmentForm />;
			break;

		case ADMISSION_PENDING:
			view = this.renderPanel(t('admissionPendingMessage'), tt('ok'));
			break;

		default:
			view = <div className="error">Unrecognized admission state: {admissionStatus}</div>;
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
