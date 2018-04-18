import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Locations, Location, NotFound} from 'react-router-component';
import {Mixins} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import ContextSender from 'common/mixins/ContextSender';

import * as Constants from '../Constants';
import Store from '../Store';

import PaymentSuccess from './PaymentSuccess';
import PaymentError from './PaymentError';
import PaymentConfirm from './PaymentConfirm';


const t = scoped('enrollment.store', {
	title: 'Enroll as a Lifelong Learner',
});

/**
 * Used by both store-enrollment/components/View and store-enrollment/components/GiftPurchaseView.
 */
export default createReactClass({
	displayName: 'StoreEnrollmentRoutes',

	mixins: [Mixins.BasePath, ContextSender, Mixins.NavigatableMixin],

	propTypes: {
		entryId: PropTypes.string.isRequired,
		purchasable: PropTypes.object.isRequired,
		defaultHandler: PropTypes.func.isRequired,
		isGift: PropTypes.bool
	},

	getDefaultProps () {
		return {
			isGift: false
		};
	},

	attachRouterRef (x) { this.router = x; },

	getContext () {
		return Promise.resolve([
			{
				label: 'Enrollment Options',
				href: this.makeHref(path.join('item', this.props.entryId, 'enrollment'))
			},
			{
				label: t('title')
			}
		]);
	},

	nav () {
		this.router.navigate(...arguments);
	},

	componentWillMount () {
		Store.addChangeListener(this.storeChange);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.storeChange);
	},

	storeChange (event) {
		const {router} = this;

		if (!router) {
			return setTimeout(()=> this.storeChange(event), 100);
		}

		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
		case Constants.PRICED_ITEM_RECEIVED:
			this.setState({
				loading: false,
				pricedItem: event.pricedItem
			});
			break;

		case Constants.EDIT:
			router.navigate('/' + (event.mode || ''), {replace: true});
			break;

		case Constants.RESET:
			router.navigate('/', {replace: true});
			break;

		case Constants.BILLING_INFO_VERIFIED:
			router.navigate('confirm/');
			break;

		case Constants.STRIPE_PAYMENT_SUCCESS:

			if ((Store.getPaymentResult() || {}).redemptionCode) {
				router.navigate('success/', {replace: true});
			} else {
				// the catalog entry we're rooted under may not exist when the catalog reloads
				// so the success message lives under the root catalog router.
				this.nav('./success/', {replace: true});
			}
			break;

		case Constants.STRIPE_PAYMENT_FAILURE:
		case Constants.POLLING_ERROR:
			router.navigate('error/', {replace: true});
			break;

		}
	},


	render () {
		const giftDoneLink = this.getBasePath() + 'catalog/';
		const courseTitle = (this.props.purchasable || {}).title || '';

		return (
			<Locations contextual ref={this.attachRouterRef}>
				<Location path="/confirm/"
					handler={PaymentConfirm}
					{...this.props}
				/>
				<Location path="/success/"
					handler={PaymentSuccess}
					{...this.props}
					giftDoneLink={giftDoneLink}
				/>
				<Location path="/error/"
					handler={PaymentError}
					courseTitle={courseTitle}
					{...this.props}
				/>
				<NotFound handler={this.props.defaultHandler}
					{...this.props}
				/>
			</Locations>
		);
	}
});
