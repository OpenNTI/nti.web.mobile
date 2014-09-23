/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('LOGIN');
var Button = require('common/components/forms/Button');
var MessageDisplay = require('common/messages/').Display;
var Constants = require('../Constants');
var URL = require('url');

module.exports = React.createClass({
	render: function() {

		var submitEnabled = true;

		var test = Object.keys(this.props.links).map(function(v) {
			return <div>{v}</div>
		});

		var basePath = this.props.basePath;

		var url = URL.resolve(basePath,this.props.links[Constants.links.FORGOT_PASSCODE]);

		return (

			<div className="row">
				<MessageDisplay />
				<div>{basePath}</div>
				xx{url}xx
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
