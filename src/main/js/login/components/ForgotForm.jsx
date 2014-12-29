'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('LOGIN.forgot');
var Button = require('./Button');
var Messages = require('messages');
var Message = Messages.Message;
var MessageActions = Messages.Actions;
var Constants = require('../Constants');

var Actions = require('../Actions');
var Router = require('react-router-component');


var _fields = {
	password: [
		{
			type: 'text',
			ref: 'username'
		},
		{
			type: 'email',
			ref: 'email'
		}
	],
	username: [
		{
			type: 'email',
			ref: 'email'
		}
	]
};

module.exports = React.createClass({

	mixins: [Router.NavigatableMixin],

	componentDidMount: function() {
		Actions.clearErrors({category: Constants.messages.category});
	},

	getInitialState: function() {
		return {
			submitEnabled: false,
			fieldValues: {}
		};
	},

	_handleSubmit: function(event) {
		event.preventDefault();
		var messageOptions = {category: Constants.messages.category};
		MessageActions.clearMessages(messageOptions);
		var action = this.props.param === 'password' ? Actions.recoverPassword : Actions.recoverUsername;
		action(this.state.fieldValues)
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

	_inputChanged: function(event) {
		var newState = {};
		newState[event.target.name] = event.target.value;
		var tmp = Object.assign(this.state.fieldValues, newState);
		this.setState({
			fieldValues: tmp
		});
		this.setState({
			submitEnabled: (this.refs.email.getDOMNode().value.trim().length > 0)
		});
	},

	_inputs: function() {
		return _fields[this.props.param].map(function(fieldConfig) {
			return (<input type={fieldConfig.type}
							ref={fieldConfig.ref}
							name={fieldConfig.ref}
							placeholder={fieldConfig.ref}
							onChange={this._inputChanged}
							defaultValue='' />);
		}.bind(this));
	},

	render: function() {

		var buttonLabel = t(this.props.param === 'password' ? 'recoverpassword' : 'recoverusername');
		var cssClasses = ['tiny','radius', 'small-12 columns'];

		var submitEnabled = this.state.submitEnabled;
		if (!submitEnabled) {
			cssClasses.push('disabled');
		}

		return (
			<div className="row">
				<form className="login-form large-6 large-centered columns" onSubmit={this._handleSubmit}>
					<fieldset>
						<legend>Recover {this.props.param}</legend>
						{this._inputs()}
						<button
							id="login:forgot:submit"
							type="submit"
							className={cssClasses.join(' ')}
							disabled={!submitEnabled}
						>{buttonLabel}</button>
					</fieldset>
					<Button id="login:forgot:return" href="/" className="fi-arrow-left"> Return to Login</Button>
				</form>
			</div>
		);
	}
});
