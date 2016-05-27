import React from 'react';

import Logger from 'nti-util-logger';

import {Error as Err, Loading, Mixins} from 'nti-web-commons';

import {scoped} from 'nti-lib-locale';

import {doExternalPayment} from '../Actions';
import Store from '../Store';
import {PAY_AND_ENROLL_ERROR} from '../Constants';

const logger = Logger.get('enrollment:five-minute:components:Payment');
const t = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'Payment',

	mixins: [Mixins.NavigatableMixin],

	propTypes: {
		paymentLink: React.PropTypes.string.isRequired, // dataserver pay and enroll link ('fmaep.pay.and.enroll')
		ntiCrn: React.PropTypes.string.isRequired, // passed to dataserver to get payment site url
		ntiTerm: React.PropTypes.string.isRequired // passed to dataserver to get payment site url
	},

	getInitialState () {
		return {
			loading: false
		};
	},

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	},

	onStoreChange (event) {
		if(event.type === PAY_AND_ENROLL_ERROR) {
			this.setState({
				loading: false,
				error: event
			});
		}
	},

	buttonClick (event) {
		event.preventDefault();
		this.setState({
			loading: true
		});

		let returnUrl = this.buildHref('../enroll/apply/paymentcomplete/');
		logger.log('UPay return URL: %s', returnUrl);

		doExternalPayment({
			link: this.props.paymentLink,
			ntiCrn: this.props.ntiCrn,
			ntiTerm: this.props.ntiTerm,
			returnUrl
		});
	},

	render () {

		if (this.state.loading) {
			return <Loading />;
		}

		if (this.state.error) {
			return <Err error={this.state.error} />;
		}

		return (

			<div className="enrollment-pending">
				<figure className="notice">
					<div>You will be taken to a secure external site for payment.</div>
				</figure>

				<a className="button tiny" href="#" onClick={this.buttonClick}>{t('proceedToPayment')}</a>
			</div>
		);
	}

});
