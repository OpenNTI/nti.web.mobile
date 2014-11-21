/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Loading = require('common/components/Loading');
var Constants = require('../Constants');
var Store = require('../Store');
var Form = require('./PaymentForm');
var GiftView = require('./GiftView');
var PaymentSuccess = require('./PaymentSuccess');
var PaymentError = require('./PaymentError');
var ErrorComponent = require('common/components/Error');
var PaymentConfirm = require('./PaymentConfirm');
var NavigatableMixin = require('common/mixins/NavigatableMixin');

var View = React.createClass({

	mixins: [NavigatableMixin], // needed for getPath() call we're using for the router's key.

	propTypes: {
		enrollment: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			loading: true
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._onChange);
		var purchasable = this.props.enrollment.Purchasable;
		Store.priceItem(purchasable)
		.then(function(pricedItem) {
			this.setState({
				loading: false,
				pricedItem: pricedItem
			});
		}.bind(this))
		.catch(function(reason) {
			this.setState({
				loading: false,
				error: reason
			});
		}.bind(this));
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},

	_onChange: function(event) {
		switch(event.type) {
			case Constants.PRICED_ITEM_RECEIVED:
				this.setState({
					loading: false,
					pricedItem: event.pricedItem
				});
			break;
			
			case Constants.BILLING_INFO_VERIFIED:
				// FIXME: why isn't this path being evaluated within the 'store'
				// router context? why do we have to include 'store'?
				this.navigate('store/confirm/');
			break;

			case Constants.STRIPE_PAYMENT_SUCCESS:
				this.navigate('store/success/');
			break;

			case Constants.STRIPE_PAYMENT_FAILURE:
				this.navigate('store/error/');
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

		var purchasable = this.props.enrollment.Purchasable;
		var courseTitle = purchasable.Title||null;
		var courseId = this.props.courseId;

		return (
			<div>
				<ReactCSSTransitionGroup transitionName="loginforms">
					<Locations contextual
						key={this.getPath()}>
						<Location path="/confirm/" handler={PaymentConfirm} purchasable={purchasable}/>
						<Location path="/success/" handler={PaymentSuccess} purchasable={purchasable} courseId={courseId} courseTitle={courseTitle}/>
						<Location path="/error/" handler={PaymentError} purchasable={purchasable} courseTitle={courseTitle}/>
						<Location path="/gift/" handler={GiftView} purchasable={purchasable} courseTitle={courseTitle}/>
						<DefaultRoute handler={Form} purchasable={purchasable}/>
					</Locations>
				</ReactCSSTransitionGroup>
			</div>
			
		);
	}

});

module.exports = View;
