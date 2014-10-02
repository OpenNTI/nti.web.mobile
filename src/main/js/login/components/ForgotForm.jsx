/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('LOGIN.forgot');
var Button = require('common/components/forms/Button');
var Messages = require('common/messages/');
var MessageDisplay = Messages.Display;
var MessageActions = Messages.Actions;
var NavigationActions = require('navigation').Actions;
var Constants = require('../Constants');
var Actions = require('../Actions');
var Link = require('react-router-component').Link;
var config = require('common/AppConfig');

module.exports = React.createClass({

	componentWillUnmount: function() {
		MessageActions.clearMessages(this);
	},

	_handleSubmit: function(event) {
		event.preventDefault();
		MessageActions.clearMessages(this);
		var action = this.props.param === 'password' ? Actions.recoverPassword : Actions.recoverUsername;
		action(this.refs.email.getDOMNode().value.trim())
		.then(function() {
			var message = 'Check your email for recovery instructions.';
			console.log(config);
			MessageActions.addMessage(message, this);
		}.bind(this))
		.catch (function(res) {
			var r = JSON.parse(res.response);
			var message = t(r.code);
			MessageActions.addMessage(message, this);
		}.bind(this));
	},

	render: function() {

		var buttonLabel = t(this.props.param === 'password' ? 'recoverpassword' : 'recoverusername');

		return (
			<div className="row">
				<MessageDisplay />
				<form className="login-form large-6 large-centered columns" onSubmit={this._handleSubmit}>
					<fieldset>
						<input type="text"
							ref="email"
							placeholder="email"
							defaultValue='' />
						<button
							type="submit"
							className='tiny radius'
						>{buttonLabel}</button>						
					</fieldset>
					<Link href="/">Log In</Link>
				</form>
			</div>
		);
	}
});
