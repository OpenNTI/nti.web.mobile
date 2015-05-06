import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import Router from 'react-router-component';
let {Locations, Location, NotFound} = Router;

import * as Constants from '../Constants';
import Store from '../Store';
import PaymentSuccess from './PaymentSuccess';
import PaymentError from './PaymentError';
import PaymentConfirm from './PaymentConfirm';
import BasePath from 'common/mixins/BasePath';

/**
* Used by both store-enrollment/components/View and store-enrollment/components/GiftPurchaseView.
*/
export default React.createClass({
	displayName: 'StoreEnrollmentRoutes',

	mixins: [BasePath],

	propTypes: {
		purchasable: React.PropTypes.object.isRequired,
		courseId: React.PropTypes.string.isRequired,
		defaultHandler: React.PropTypes.element.isRequired,
		isGift: React.PropTypes.bool
	},

	getDefaultProps: function() {
		return {
			isGift: false
		};
	},

	navigate() {
		this.refs.router.navigate(...arguments);
	},

	componentDidMount: function() {
		Store.addChangeListener(this.storeChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this.storeChange);
	},

	storeChange (event) {
		let router = this.refs.router;
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.PRICED_ITEM_RECEIVED:
				this.setState({
					loading: false,
					pricedItem: event.pricedItem
				});
				break;

			case Constants.GIFT_PURCHASE_DONE:
				router.navigate('/', {replace: true});
				break;

			case Constants.EDIT:
				router.navigate('/' + event.mode);
				break;

			case Constants.RESET:
				router.navigate('/', {replace: true});
				break;

			case Constants.BILLING_INFO_VERIFIED:
				router.navigate('confirm/');
				break;

			case Constants.STRIPE_PAYMENT_SUCCESS:

				if ((Store.getPaymentResult() || {}).RedemptionCode) {
					router.navigate('success/');
				} else {
					// the catalog entry we're rooted under may not exist when the catalog reloads
					// so the success message lives under the root catalog router.
					this.navigate('../enrollment/success/');
				}
				break;

			case Constants.STRIPE_PAYMENT_FAILURE:
			case Constants.POLLING_ERROR:
				router.navigate('error/');
				break;

		}
	},


	render () {

		let giftDoneLink = this.getBasePath() + 'catalog/';
		let courseTitle = (this.props.purchasable || {}).Title || '';

		return (
			<ReactCSSTransitionGroup transitionName="loginforms">
				<Locations contextual
					ref='router'>
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
			</ReactCSSTransitionGroup>
		);
	}
});
