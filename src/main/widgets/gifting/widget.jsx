'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = require("react/lib/ReactCSSTransitionGroup");

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;
var CaptureClicks = require('react-router-component/lib/CaptureClicks');

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
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.PRICED_ITEM_RECEIVED:
				this.setState({
					loading: false,
					pricedItem: event.pricedItem
				});
				break;

			case Constants.EDIT:
				router.navigate('/');
				break;

			case Constants.RESET:
				router.navigate('/', {replace: true});
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


	_onDone: function() {
		window.top.location.href = 'https://historychannel.ou.edu';
	},


	onNavigation: function() {
		parent.postMessage('{"event": "navigation"}', '*');
	},


	render: function() {
		if(this.state.error) {
			return <div className="column"><ErrorComponent error={this.state.error} /></div>;
		}

		if(this.state.loading) {
			return <Loading />;
		}

		var purchasable = this.state.purchasable;
		var courseTitle = purchasable.Title;

		return (
			<CaptureClicks environment={Router.environment.hashEnvironment}>
				<ReactCSSTransitionGroup transitionName="loginforms">
					<Locations hash ref="router" onNavigation={this.onNavigation}>
						<Location path="/confirm/*" handler={Confirm} purchasable={purchasable}/>
						<Location path="/success/*" handler={Success} purchasable={purchasable} onDone={this._onDone} />
						<Location path="/error/*" handler={PaymentError} courseTitle={courseTitle} />
						<DefaultRoute handler={Form} purchasable={purchasable}/>
					</Locations>
				</ReactCSSTransitionGroup>
			</CaptureClicks>
		);
	}
});
