/** @jsx React.DOM */

'use strict';

var LoginStore = require('../LoginStore');
var LoginActions = require('../LoginActions');

var React = require('react/addons');

var LoginView = React.createClass({

	componentDidMount: function() {
		debugger;
		console.log('LoginView::componentDidMount');
		LoginStore.addChangeListener(this._onChange);
		LoginActions.begin();
	},

	componentWillUnmount: function() {
		console.log('LoginView::componentWillUnmount');
		LoginStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div>
				(LoginView)
			</div>
		);
	},

	_onChange: function() {
		console.log('LoginView::_onChange invoked');
	}

});

module.exports = LoginView;
