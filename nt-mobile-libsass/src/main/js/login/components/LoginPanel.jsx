/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var LoginController = require('../LoginController');
var LoginActions = require('../LoginActions');
var LoginConstants = require('../LoginConstants');
var DebugInfo = require('./DebugInfo');
var Button = require('../../common/components/forms/Button');

/**
* Login Form React component
* @class LoginForm
*/
var LoginForm = React.createClass({

	getInitialState: function() {
		return {
			username: '',
			password: ''
		};
	},

	/**
	* Submit-handler for the html login form; Invokes LoginActions.log_in.
	* @method handleSubmit
	*/
	handleSubmit: function(event) {
		var username = this.refs.username.state.value;
		var pw = this.refs.password.state.value;
		LoginActions.log_in({username: username, password:pw});
	},

	render: function() {
		return (
			<div className="row">
				<form className="login-form large-6 large-centered columns" onSubmit={this.handleSubmit}>
					<fieldset>
						<input type="text" ref="username" placeholder="Username" defaultValue={this.state.username} />
						<input type="password" ref="password" placeholder="Password" defaulValue={this.state.password} />
						<Button
							className={this.props.submitEnabled ? '' : 'disabled'}
							onClick={this.props.submitEnabled ? this.handleSubmit : function(){return false}}>Log In</Button>
					</fieldset>
				</form>
				<DebugInfo />
			</div>
		);
	}
});

/**
* React component for housing LoginForm
* @class LoginPanel
*/
var LoginPanel = React.createClass({

	componentDidMount: function() {
		LoginActions.begin();
	},

	render: function() {
		return (
			<div className="login-panel">
				<LoginForm submitEnabled={LoginController.canDoPasswordLogin()}/>
			</div>
		);
	}
});

module.exports = LoginPanel;
