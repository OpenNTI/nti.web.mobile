/** @jsx React.DOM */

'use strict';

var Store = require('../Store');
var LoginStoreProperties = require('../StoreProperties');
var Actions = require('../Actions');
var Button = require('common/components/forms/Button');
var OAuthButtons = require('./OAuthButtons');
var RecoveryLinks = require('./RecoveryLinks');
var t = require('common/locale').translate;
var React = require('react/addons');
var MessageDisplay = require('common/messages/').Display;


var View = React.createClass({

	getInitialState: function() {
		return {
			username: '',
			password: '',
			submitEnabled: false,
			links: {}
		};
	},

	componentDidMount: function() {
		console.log('LoginView::componentDidMount');
		Store.addChangeListener(this._onLoginStoreChange);
	},

	componentWillUnmount: function() {
		console.log('LoginView::componentWillUnmount');
		Store.removeChangeListener(this._onLoginStoreChange);
		delete this.state.password;
	},

	render: function() {
		var submitEnabled = this.state.submitEnabled;

		return (
			<div className="row">
				<MessageDisplay />
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
						<button
							type="submit"
							className={'tiny radius ' + (submitEnabled ? '' : 'disabled')}
							disabled={!submitEnabled}
						>{t('LOGIN.login')}</button>
						<OAuthButtons links={this.state.links} basePath={this.props.basePath} />
						
					</fieldset>
					<RecoveryLinks links={this.state.links} basePath={this.props.basePath} />
				</form>
			</div>
		);
	},

	/**
	* onChange handler for the username field. Triggers Actions.userInputChanged
	*/
	_usernameChanged: function(event) {
		Actions.userInputChanged({
			credentials: {
				username: this._username(),
				password: this._password()
			},
			event: event
		});
	},

	_passwordChanged: function(event) {
		this._updateSubmitButton();
	},

	_handleSubmit: function(evt) {
		evt.preventDefault();
		console.log('LoginView::_handleSubmit');
		Actions.clearErrors();
		Actions.logIn({
			username: this._username(),
			password: this._password()
		});
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
				this._username().length > 0 &&
				this._password().length > 0 &&
				Store.canDoPasswordLogin()
		});
	},

	_onLoginStoreChange: function(evt) {
		console.log('LoginView::_onLoginStoreChange invoked %O', evt);
		if (this.isMounted()) {
			this._updateSubmitButton();
		}
		if (evt && evt.property === LoginStoreProperties.links) {
			this.setState({links: evt.value});
		}
	}
});

module.exports = View;
