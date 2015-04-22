

import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import Router from 'react-router-component';
let {Locations, Location, NotFound} = Router;

import Constants from '../Constants';
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

let View = React.createClass({
	displayName: 'StoreEnrollmentView',

	mixins: [NavigatableMixin, BasePathAware], // needed for getPath() call we're using for the router's key.

	propTypes: {
		courseId: React.PropTypes.string,
		enrollment: React.PropTypes.shape({
			Purchasable: React.PropTypes.object
		}).isRequired
	},

	getInitialState () {
		return {
			loading: true
		};
	},


	getPurchasable () {
		let {enrollment} = this.props;

		if (!enrollment) {
			console.warn('Missing prop value for `enrollment`!!');
			return;
		}

		let {Purchasable} = enrollment;

		return Purchasable || (()=>{
			console.warn('Enrollment.Purchasable is not defined!');
		})();
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
				router.navigate('success/');
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
		let courseTitle = (purchasable || {}).Title || '';
		let {courseId} = this.props;
		let giftDoneLink = this.getBasePath() + 'catalog/';
		let isGift = !!Store.getGiftInfo();

		return (
			<div>
				<ReactCSSTransitionGroup transitionName="loginforms">
					<Locations contextual
						ref='router'>
						<Location path="/confirm/" handler={PaymentConfirm} purchasable={purchasable}/>
						<Location path="/success/"
							handler={PaymentSuccess}
							purchasable={purchasable}
							courseId={courseId}
							giftDoneLink={giftDoneLink} />
						<Location path="/error/"
							handler={PaymentError}
							isGift={isGift}
							purchasable={purchasable}
							courseTitle={courseTitle} />
						<Location path="/gift/"
							handler={GiftView}
							purchasable={purchasable}
							courseTitle={courseTitle} />
						<Location path="/gift/redeem/(:code)"
							handler={GiftRedeem}
							purchasable={purchasable}
							courseTitle={courseTitle}
							courseId={courseId} />
						<NotFound handler={Form} purchasable={purchasable}/>
					</Locations>
				</ReactCSSTransitionGroup>
			</div>

		);
	}

});

module.exports = View;
