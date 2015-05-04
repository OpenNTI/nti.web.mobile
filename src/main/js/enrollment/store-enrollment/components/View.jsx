

import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import Router from 'react-router-component';
let {Locations, Location, NotFound} = Router;

import * as Constants from '../Constants';
import Store from '../Store';

import Form from './PaymentForm';
import GiftView from './GiftView';
import GiftRedeem from './GiftRedeem';
import PaymentSuccess from './PaymentSuccess';
import PaymentError from './PaymentError';
import PaymentConfirm from './PaymentConfirm';

import Loading from 'common/components/Loading';
import ErrorComponent from 'common/components/Error';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'StoreEnrollmentView',

	mixins: [NavigatableMixin, BasePathAware], // needed for getPath() call we're using for the router's key.

	propTypes: {
		courseId: React.PropTypes.string,
		entryId: React.PropTypes.string,
		enrollment: React.PropTypes.shape({
			Purchasable: React.PropTypes.object
		}).isRequired
	},

	getInitialState () {
		return {
			loading: true
		};
	},


	getPurchasable (forGifting=false) {
		let {enrollment} = this.props;

		if (!enrollment) {
			console.warn('Missing prop value for `enrollment`!!');
			return;
		}

		let {Purchasables} = enrollment;

		if (!Purchasables) {
			console.warn('Enrollment.Purchasables is not defined!');
			return null;
		}
		let id = forGifting ? Purchasables.DefaultGiftingNTIID : Purchasables.DefaultPurchaseNTIID;
		return Purchasables.Items.find((element) => element.ID === id);
	},

	componentDidMount () {
		Store.addChangeListener(this.onChange);

		let purchasable = this.getPurchasable();

		Store.priceItem(purchasable).then(
			pricedItem => this.setState({ loading: false, pricedItem }),
			error => this.setState({ loading: false, error })
		);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onChange);
	},

	onChange (event) {
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
				let path = event.options && event.options.gift ? '/gift/' : '/';
				router.navigate(path, {replace: true});
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

		if(this.state.error) {
			return <div className="column"><ErrorComponent error={this.state.error} /></div>;
		}

		if(this.state.loading) {
			return <Loading />;
		}

		let purchasable = this.getPurchasable();
		let giftPurchasable = this.getPurchasable(true);
		let courseTitle = (purchasable || {}).Title || '';
		let {entryId, courseId} = this.props;
		let giftDoneLink = this.getBasePath() + 'catalog/';
		let isGift = !!Store.getGiftInfo();

		return (
			<div>
				<ReactCSSTransitionGroup transitionName="loginforms">
					<Locations contextual
						ref='router'>
						<Location path="/confirm/"
							handler={PaymentConfirm}
							purchasable={isGift ? giftPurchasable : purchasable}
							/>
						<Location path="/success/"
							handler={PaymentSuccess}
							purchasable={isGift ? giftPurchasable : purchasable}
							courseId={courseId}
							giftDoneLink={giftDoneLink} />
						<Location path="/error/"
							handler={PaymentError}
							isGift={isGift}
							purchasable={isGift ? giftPurchasable : purchasable}
							courseTitle={courseTitle} />
						<Location path="/gift/"
							handler={GiftView}
							purchasable={giftPurchasable}
							courseTitle={courseTitle} />
						<NotFound handler={Form} purchasable={purchasable}/>
					</Locations>
				</ReactCSSTransitionGroup>
			</div>

		);
	}

});
