/** @jsx React.DOM */

'use strict';

var LoginStore = require('../LoginStore');
var LoginActions = require('../LoginActions');
var Button = require('../../common/components/forms/Button');

var React = require('react/addons');

var LoginView = React.createClass({

	getInitialState: function() {
		return {
			username:'',
			password:'',
			submitEnabled: false
		};
	},

	componentDidMount: function() {
		console.log('LoginView::componentDidMount');
		LoginStore.addChangeListener(this._onLoginStoreChange);
		// LoginActions.begin();
	},

	componentWillUnmount: function() {
		console.log('LoginView::componentWillUnmount');
		LoginStore.removeChangeListener(this._onLoginStoreChange);
	},

	render: function() {
		var submitEnabled = this.state.submitEnabled;
		return (
			<div className="row">
				<form className="login-form large-6 large-centered columns" onSubmit={this._handleSubmit}>
					<fieldset>
						<input type="text"
							ref="username"
							placeholder="Username"
							defaultValue={this.state.username}
							onChange={this._usernameChanged} />
						<input type="password"
							ref="password"
							placeholder="Password"
							defaulValue={this.state.password}
							onChange={this._passwordChanged} />
						<Button
							className={submitEnabled ? '' : 'disabled'}
							onClick={submitEnabled ? this._handleSubmit : function(){return false}}>Log In</Button>
					</fieldset>
				</form>
			</div>
		);
	},

	/**
	* onChange handler for the username field. Triggers LoginActions.userInputChanged
	* @method usernameChanged
	*/
	_usernameChanged: function(event) {
		LoginActions.userInputChanged({
			credentials: {
				username:this._username(),
				password:this._password()
			},
			event:event
		});
	},

	_passwordChanged: function(event) {
		this._updateSubmitButton();
	},

	_handleSubmit: function() {
		console.log('LoginView::_handleSubmit');
		LoginActions.logIn({
			username:this._username(),
			password:this._password()
		})
	},

	_username: function() {
		return this.refs.username.getDOMNode().value.trim();
	},

	_password: function() {
		return this.refs.password.getDOMNode().value.trim();
	},

	_updateSubmitButton: function() {
		this.setState({
			submitEnabled:
				this._username().length > 0
				&& this._password().length > 0
				&& LoginStore.canDoPasswordLogin()
		});
	},

	_onLoginStoreChange: function() {
		console.log('LoginView::_onLoginStoreChange invoked');
		this._updateSubmitButton();
	}

});

module.exports = LoginView;
