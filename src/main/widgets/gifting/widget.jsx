/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;

var getServer = require('common/Utils').getServer;

var Loading = require('common/components/Loading');
var ErrorComponent = require('common/components/Error');

var Constants = require('enrollment/store-enrollment/Constants');
var Store = require('enrollment/store-enrollment/Store');


var Form = require('enrollment/store-enrollment/components/GiftView');

var Confirm = require('enrollment/store-enrollment/components/PaymentConfirm');
var Success = require('enrollment/store-enrollment/components/PaymentSuccess');
var PaymentError = require('enrollment/store-enrollment/components/PaymentError');

module.exports = React.createClass({


	getInitialState: function() {
		return {
			loading: true,
			purchasable: null
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._onChange);

		var purchasableId = this.props.purchasableId;
		if (!purchasableId) {
			this.setState({
				loading: false,
				error: 'Missing ID'
			});
			return;
		}

		getServer().getPurchasables(purchasableId)
			.then(x => x.Items[0])
			.then(x => {
				this.setState({purchasable: x});
				return x;
			})
			.then(Store.priceItem.bind(Store))
			.then(pricedItem => {
				this.setState({
					loading: false,
					pricedItem: pricedItem
				});
			})
			.catch(reason => {
				this.setState({
					loading: false,
					error: reason
				});
			});
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},

	_onChange: function(event) {
		var router = this.refs.router;

		switch(event.type) {
			case Constants.PRICED_ITEM_RECEIVED:
				this.setState({
					loading: false,
					pricedItem: event.pricedItem
				});
				break;

			case Constants.BILLING_INFO_VERIFIED:
				router.navigate('/confirm/');
				break;

			case Constants.STRIPE_PAYMENT_SUCCESS:
				router.navigate('/success/');
				break;

			case Constants.STRIPE_PAYMENT_FAILURE:
				router.navigate('/error/');
				break;
		}
	},

	render: function() {

		if(this.state.error) {
			return <div className="column"><ErrorComponent error={this.state.error} /></div>;
		}

		if(this.state.loading) {
			return <Loading />;
		}

		var purchasable = this.state.purchasable;

		return (
			<div>
				<ReactCSSTransitionGroup transitionName="loginforms">
					<Locations hash ref="router">
						<Location path="/confirm/" handler={Confirm} purchasable={purchasable}/>

						<Location path="/success/" handler={Success} purchasable={purchasable} />

						<Location path="/error/" handler={PaymentError} purchasable={purchasable} />
						<DefaultRoute handler={Form} purchasable={purchasable}/>
					</Locations>
				</ReactCSSTransitionGroup>
			</div>
		);
	}
});
