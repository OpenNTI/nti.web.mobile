/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('LOGIN.forgot');
var Button = require('common/components/forms/Button');
var Messages = require('common/messages/');
var Message = Messages.Message;
var MessageDisplay = Messages.Display;
var MessageActions = Messages.Actions;
var NavigationActions = require('navigation').Actions;
var Constants = require('../Constants');
var Actions = require('../Actions');
var Link = require('react-router-component').Link;
var config = require('common/AppConfig');

module.exports = React.createClass({

	componentDidMount: function() {
		Actions.clearErrors({category: Constants.messages.category});
	},

	getInitialState: function() {
		return {
			submitEnabled: false
		};
	},

	_handleSubmit: function(event) {
		event.preventDefault();
		var messageOptions = {category: Constants.messages.category};
		MessageActions.clearMessages(messageOptions);
		var action = this.props.param === 'password' ? Actions.recoverPassword : Actions.recoverUsername;
		action(this.refs.email.getDOMNode().value.trim())
		.then(function() {
			var message = new Message('Check your email for recovery instructions.', messageOptions);
			MessageActions.addMessage(message, messageOptions);
		}.bind(this))
		.catch (function(res) {
			var r = JSON.parse(res.response);
			var message = new Message(t(r.code), messageOptions);
			MessageActions.addMessage(message);
		}.bind(this));
	},

	_inputChanged: function() {
		this.setState({
			submitEnabled: (this.refs.email.getDOMNode().value.trim().length > 0)
		});
	},

	render: function() {

		var buttonLabel = t(this.props.param === 'password' ? 'recoverpassword' : 'recoverusername');
		var cssClasses = ['tiny','radius'];

		var submitEnabled = this.state.submitEnabled;
		if (!submitEnabled) {
			cssClasses.push('disabled');
		}

		return (
			<div className="row">
				<form className="login-form large-6 large-centered columns" onSubmit={this._handleSubmit}>
					<fieldset>
						<input type="text"
							ref="email"
							placeholder="email"
							onChange={this._inputChanged}
							defaultValue='' />
						<button
							type="submit"
							className={cssClasses.join(' ')}
							disabled={!submitEnabled}
						>{buttonLabel}</button>
					</fieldset>
					<Link href="/">Log In</Link>
				</form>
			</div>
		);
	}
});
