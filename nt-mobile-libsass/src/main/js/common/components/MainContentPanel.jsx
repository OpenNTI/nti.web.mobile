/** @jsx React.DOM */

var React = require('react/addons');
var LeftNav = require('./LeftNav');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var LoginController = require('../../login/LoginController');
var LoginPanel = require('../../login/components/LoginPanel');

var MainContentPanel = React.createClass({


	render: function() {
		return (
			<div>
				<div>{this.props.loggedIn ? 'Yep' : 'Nope'}</div>
				<LoginPanel />
			</div>
		);
	}
});

module.exports = MainContentPanel;
