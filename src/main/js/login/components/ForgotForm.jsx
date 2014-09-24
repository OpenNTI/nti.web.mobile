/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('LOGIN');
var Button = require('common/components/forms/Button');
var MessageDisplay = require('common/messages/').Display;
var Constants = require('../Constants');
var Actions = require('../Actions');

module.exports = React.createClass({

	_handleSubmit: function(event) {
		event.preventDefault();
		alert(this.refs.username.getDOMNode().value.trim());
		Actions.recoverPassword(this.refs.username);
	},

	render: function() {

		var submitEnabled = true;

		return (
			<div className="row">
				<MessageDisplay />
				<form className="login-form large-6 large-centered columns" onSubmit={this._handleSubmit}>
					<fieldset>
						<input type="text"
							ref="username"
							placeholder="Username"
							defaultValue=''
							onChange={this._usernameChanged} />
						<button
							type="submit"
							className={'tiny radius ' + (submitEnabled ? '' : 'disabled')}
							disabled={!submitEnabled}
						>{t('login')}</button>
					
					</fieldset>
				</form>
			</div>
		);
	}
});
