/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;
var LoginForm = require('./LoginForm');
var ForgotForm = require('./ForgotForm');
var Store = require('../Store');
var StoreProperties = require('../StoreProperties');
var Actions = require('../Actions');
var Loading = require('common/components/Loading');

function _storeChanged(event) {
	if (event.property === StoreProperties.links) {
		this.setState({
			links: event.value,
			initialized: true
		});
	}
}

var View = React.createClass({

	getInitialState: function() {
		return {
			links: {},
			initialized: false
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(_storeChanged.bind(this));
		Actions.begin();
	},

	componentWillUnmount: function() {
		Store.removeChangeListener();
	},

	render: function() {

		if (!this.state.initialized) {
			return <Loading />
		}

		return (
			<Locations contextual>
				<DefaultRoute handler={LoginForm} />
				<Location path="/forgot/:param" handler={ForgotForm} links={this.state.links} />
			</Locations>
		);		
	}
});

module.exports = View;
