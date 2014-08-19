/** @jsx React.DOM */

var React = require('react/addons');
var LeftNav = require('./LeftNav');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var LoginController = require('../../login/LoginController');
var LoginPanel = require('../../login/components/LoginPanel');

var MainContentPanel = React.createClass({displayName: 'MainContentPanel',
	render: function() {
		if(this.props.loggedIn) {
			return (React.DOM.div( {class:"content"}, "this is content"));
		}
		return (
			React.DOM.div(null, 
				React.DOM.div(null, this.props.loggedIn ? 'Yep' : 'Nope'),
				LoginPanel(null )
			)
		);
	}
});

module.exports = MainContentPanel;
