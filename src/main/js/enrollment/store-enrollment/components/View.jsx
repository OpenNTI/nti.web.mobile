'use strict';

var React = require('react');
var ReactCSSTransitionGroup = require("react/lib/ReactCSSTransitionGroup");

var Router = require('react-router-component');
var {Locations, Location, NotFound} = Router;

var Constants = require('../Constants');
var Store = require('../Store');

var Form = require('./PaymentForm');
var GiftView = require('./GiftView');
var GiftRedeem = require('./GiftRedeem');
var PaymentSuccess = require('./PaymentSuccess');
var PaymentError = require('./PaymentError');
var PaymentConfirm = require('./PaymentConfirm');

var Loading = require('common/components/Loading');
var ErrorComponent = require('common/components/Error');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var {getBasePath} = require('common/utils');


var View = React.createClass({

	mixins: [NavigatableMixin], // needed for getPath() call we're using for the router's key.

	propTypes: {
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
		var {enrollment} = this.props;

		if (!enrollment) {
			console.warn('Missing prop value for `enrollment`!!');
			return;
		}

		var {Purchasable} = enrollment;

		return Purchasable || (()=>{
			console.warn('Enrollment.Purchasable is not defined!');
		})();
	},


	componentDidMount () {
		Store.addChangeListener(this._onChange);
		var purchasable = this.getPurchasable();
		Store.priceItem(purchasable).then(
			pricedItem => {
				this.setState({
					loading: false,
					pricedItem: pricedItem
				});
			},
			reason => {
				this.setState({
					loading: false,
					error: reason
				});
			}
		);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this._onChange);
	},

	_onChange (event) {
		var router = this.refs.router;
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
				var path = event.options && event.options.gift ? '/gift/' : '/';
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

		var purchasable = this.getPurchasable();
		var courseTitle = (purchasable || {}).Title || '';
		var courseId = this.props.courseId;
		var giftDoneLink = getBasePath() + 'library/catalog/';
		var isGift = !!Store.getGiftInfo();

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
