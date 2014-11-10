/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Loading = require('common/components/Loading');
var Constants = require('../Constants');
var Store = require('../Store');
var Form = require('./Form');

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
		if(event.eventType === Constants.PRICED_ITEM_RECEIVED) {
			this.setState({
				loading: false,
				pricedItem: event.pricedItem
			});	
		}
	},

	render: function() {

		if(this.state.loading) {
			return <Loading />;
		}

		return (
			<div>
				<Form />
			</div>
		);
	}

});

module.exports = View;
