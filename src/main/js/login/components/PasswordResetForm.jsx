/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('LOGIN.forgot');
var Button = require('./Button');

var Actions = require('../Actions');

var _fields = [
	{
		ref: 'password',
		type: 'password',
		placeholder: 'New Password'
	},
	{
		ref: 'password2',
		type: 'password',
		placeholder: 'Verify Password',
		getError: function(value,fieldValues) {
			return (value !== fieldValues.password) ? {message: 'Passwords do not match.'} : null;
		}
	},
];

var _errs = {};

var PasswordResetForm = React.createClass({

	getInitialState: function() {
		return {
			submitEnabled: false,
			fieldValues: {}
		};
	},

	_inputs: function() {
		return _fields.map(function(fieldConfig) {

			var err = _errs[fieldConfig.ref];
			var cssClass = err ? 'error' : null;
			var error = err ? <small className='error'>{err.message}</small> : null;

			return (
				<div key={fieldConfig.ref}><input type={fieldConfig.type}
					ref={fieldConfig.ref}
					name={fieldConfig.ref}
					placeholder={fieldConfig.placeholder || fieldConfig.ref}
					onChange={this._inputChanged}
					className={cssClass}
					defaultValue='' />{error}</div>
			);
		}.bind(this));
	},

	_fieldsValid: function() {
		_errs = {};
		return _fields.every(function(fieldConfig) {
			var value = this.state.fieldValues[fieldConfig.ref];
			if((value||'').trim().length === 0) {
				return false;
			}
			var fieldErr = fieldConfig.getError ? fieldConfig.getError(value,this.state.fieldValues) : null;
			if(fieldErr) {
				_errs[fieldConfig.ref] = fieldErr;
				return false;
			}
			return !fieldErr;
		}.bind(this));
	},

	_validateInput: function() {
		return this._fieldsValid();
	},

	_inputChanged: function(event) {
		var newState = {};
		newState[event.target.name] = event.target.value;
		var tmp = Object.assign(this.state.fieldValues, newState);
		this.setState({
			fieldValues: tmp
		});
	},

	_handleSubmit: function(event) {
		event.preventDefault();
		Actions.resetPassword({
			username: this.props.username,
			password: this.state.fieldValues[_fields[0].ref],
			token: this.props.token
		});
	},

	render: function() {

		var buttonLabel = t('RESET_PW', {fallback: 'Reset Password'});
		var cssClasses = ['tiny','radius', 'small-12 columns'];

		var submitEnabled = this._validateInput();
		if (!submitEnabled) {
			cssClasses.push('disabled');
		}

		var inputs = this._inputs();

		return (
			<div className="row">
				<form className="login-form large-6 large-centered columns" onSubmit={this._handleSubmit}>
					<fieldset>
						<legend>Reset your password</legend>
						{inputs}
						<button
							type="submit"
							className={cssClasses.join(' ')}
							disabled={!submitEnabled}
						>{buttonLabel}</button>
					</fieldset>
					<Button href="/" className="fi-arrow-left"> Return to Login</Button>
				</form>
			</div>
		);
	}

});

module.exports = PasswordResetForm;
