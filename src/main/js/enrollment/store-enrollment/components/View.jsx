/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Loading = require('common/components/Loading');
var Constants = require('../Constants');
var Store = require('../Store');
var Form = require('./PaymentForm');
var Redirect = require('common/components/Redirect');

var View = React.createClass({

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
		Store.priceItem(purchasable);
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
				this.setState({
					redirect: 'boom'
				});
			break;
		}
	},

	render: function() {

		if(this.state.redirect) {
			return <Redirect location={this.state.redirect} />;
		}

		if(this.state.loading) {
			return <Loading />;
		}

		var purchasable = this.props.enrollment.Purchasable;

		return (
			<div>
				<Form purchasable={purchasable} />
			</div>
		);
	}

});

module.exports = View;
