

import React from 'react';

import Button from './Button';
import Store from '../Store';
import PanelButton from 'common/components/PanelButton';

import * as Constants from '../Constants';
import * as Actions from '../Actions';
import {scoped} from 'common/locale';
let t = scoped('LOGIN.forgot');

const fieldsValid = 'PasswordResetForm:fieldsValid';
const handleSubmit = 'PasswordResetForm:handleSubmit';
const inputChanged = 'PasswordResetForm:inputChanged';
const inputs = 'PasswordResetForm:inputs';
const storeChanged = 'PasswordResetForm:storeChanged';
const validateInput = 'PasswordResetForm:validateInput';

const fields = [
	{
		ref: 'password',
		type: 'password',
		placeholder: 'New Password'
	},
	{
		ref: 'password2',
		type: 'password',
		placeholder: 'Verify Password',
		getError: function(value, fieldValues) {
			return (value !== fieldValues.password) ? {message: 'Passwords do not match.'} : null;
		}
	}
];

let errs = {};

export default React.createClass({

	displayName: 'PasswordResetForm',

	propTypes: {
		username: React.PropTypes.string,
		token: React.PropTypes.string
	},

	getInitialState: function() {
		return {
			submitEnabled: false,
			resetSuccessful: false,
			fieldValues: {}
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this[storeChanged]);
	},

	[storeChanged]: function(event) {
		if(event.type === Constants.events.PASSWORD_RESET_SUCCESSFUL) {
			this.setState({
				resetSuccessful: true
			});
		}
	},

	[inputs]: function() {
		return fields.map(function(fieldConfig) {

			let err = errs[fieldConfig.ref];
			let cssClass = err ? 'error' : null;
			let error = err ? <small className='error'>{err.message}</small> : null;

			return (
				<div key={fieldConfig.ref}><input type={fieldConfig.type}
					ref={fieldConfig.ref}
					name={fieldConfig.ref}
					placeholder={fieldConfig.placeholder || fieldConfig.ref}
					onChange={this[inputChanged]}
					className={cssClass}
					defaultValue='' />{error}</div>
			);
		}.bind(this));
	},

	[fieldsValid]: function() {
		errs = {};
		return fields.every(function(fieldConfig) {
			let value = this.state.fieldValues[fieldConfig.ref];
			if((value || '').trim().length === 0) {
				return false;
			}
			let fieldErr = fieldConfig.getError ? fieldConfig.getError(value, this.state.fieldValues) : null;
			if(fieldErr) {
				errs[fieldConfig.ref] = fieldErr;
				return false;
			}
			return !fieldErr;
		}.bind(this));
	},

	[validateInput]: function() {
		return this[fieldsValid]();
	},

	[inputChanged]: function(event) {
		let newState = {};
		newState[event.target.name] = event.target.value;
		let tmp = Object.assign(this.state.fieldValues, newState);
		this.setState({
			fieldValues: tmp
		});
	},

	[handleSubmit]: function(event) {
		event.preventDefault();
		let promise = Actions.resetPassword({
			username: this.props.username,
			password: this.state.fieldValues[fields[0].ref],
			token: this.props.token
		});

		promise.catch(function(reason) {
			console.debug(reason);
		});
	},

	render: function() {

		let button = <Button href="/" className="fi-arrow-left"> Return to Login</Button>;

		if (this.state.resetSuccessful) {
			return <PanelButton href="/" button={button}>{t('resetSuccessful')}</PanelButton>;
		}

		let buttonLabel = t('RESET_PW', {fallback: 'Reset Password'});
		let cssClasses = ['tiny small-12 columns'];

		let submitEnabled = this[validateInput]();
		if (!submitEnabled) {
			cssClasses.push('disabled');
		}

		return (
			<div className="row">
				<form className="login-form large-6 large-centered columns" onSubmit={this[handleSubmit]}>
					<fieldset>
						<legend>Reset your password</legend>
						{this[inputs]()}
						<button
							type="submit"
							className={cssClasses.join(' ')}
							disabled={!submitEnabled}
						>{buttonLabel}</button>
					</fieldset>
					{button}
				</form>
			</div>
		);
	}

});

