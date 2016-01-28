import React from 'react';
import path from 'path';

import Router from 'react-router-component';
let {Locations, Location, NotFound} = Router;

import * as Constants from '../Constants';
import Store from '../Store';
import PaymentSuccess from './PaymentSuccess';
import PaymentError from './PaymentError';
import PaymentConfirm from './PaymentConfirm';
import BasePath from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {scoped} from 'common/locale';

let t = scoped('ENROLLMENT');
/**
 * Used by both store-enrollment/components/View and store-enrollment/components/GiftPurchaseView.
 */
export default React.createClass({
	displayName: 'StoreEnrollmentRoutes',

	mixins: [BasePath, ContextSender, NavigatableMixin],

	propTypes: {
		entryId: React.PropTypes.string.isRequired,
		purchasable: React.PropTypes.object.isRequired,
		defaultHandler: React.PropTypes.func.isRequired,
		isGift: React.PropTypes.bool
	},

	getDefaultProps () {
		return {
			isGift: false
		};
	},

	getContext () {
		return Promise.resolve([
			{
				label: 'Enrollment Options',
				href: this.makeHref(path.join('item', this.props.entryId, 'enrollment'))
			},
			{
				label: t('storeEnrollmentTitle')
			}
		]);
	},

	nav () {
		this.refs.router.navigate(...arguments);
	},

	componentWillMount () {
		Store.addChangeListener(this.storeChange);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.storeChange);
	},

	storeChange (event) {
		const {router} = this.refs;

		if (!router && this.isMounted()) {
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

		let giftDoneLink = this.getBasePath() + 'catalog/';
		let courseTitle = (this.props.purchasable || {}).title || '';

		return (
			<Locations contextual ref="router">
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
