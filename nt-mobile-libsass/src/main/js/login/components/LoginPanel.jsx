/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var LoginController = require('../controllers/LoginController');
var LoginActions = require('../actions/LoginActions');

var LoginForm = React.createClass({

	getInitialState: function() {
		return {
			username: '',
			password: ''
		};
	},

	handleSubmit: function(event) {
		var username = this.refs.username.state.value;
		var pw = this.refs.password.state.value;
		console.log(username,pw);
	},

	render: function() {
		return (
			<div className="row">
				<form className="login-form large-6 large-centered columns" onSubmit={this.handleSubmit}>
					<fieldset>
						<input type="text" ref="username" placeholder="Username" defaultValue={this.state.username} />
						<input type="password" ref="password" placeholder="Password" defaulValue={this.state.password} />
						<a href="#" className="button tiny radius" onClick={this.handleSubmit}>Log In</a>
					</fieldset>
				</form>
			</div>
		);
	}
});

var LoginPanel = React.createClass({

	componentDidMount: function() {
		LoginController.addChangeListener(this._onChange);
		LoginActions.begin();
	},

	componentWillUnmount: function() {
		LoginController.removeChangeListener(this._onChange);
	},

	render: function() {
		return (
			<div className="login-panel">
				<LoginForm />
			</div>
		);
	},

	_onChange: function() {
		console.log('LoginPanel::onChange invoked');
	}

});

module.exports = LoginPanel;
