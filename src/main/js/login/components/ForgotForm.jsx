import React from 'react';

import {scoped} from 'common/locale';
import Message from 'messages/Message';
import MessageActions from 'messages/Actions';

import * as Constants from '../Constants';
import Button from './Button';

import * as Actions from '../Actions';
import Router from 'react-router-component';

const t = scoped('LOGIN.forgot');

const FIELDS = {
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

export default React.createClass({
	displayName: 'ForgotForm',

	mixins: [Router.NavigatableMixin],

	propTypes: {
		param: React.PropTypes.string
	},

	componentDidMount () {
		Actions.clearErrors({category: Constants.messages.category});
	},

	getInitialState () {
		return {
			submitEnabled: false,
			fieldValues: {}
		};
	},

	handleSubmit (event) {
		event.preventDefault();
		let messageOptions = {category: Constants.messages.category};
		MessageActions.clearMessages(messageOptions);
		let action = this.props.param === 'password' ?
			Actions.recoverPassword :
			Actions.recoverUsername;

		action(this.state.fieldValues)
			.then(() => {
				let message = new Message('Check your email for recovery instructions.', messageOptions);
				MessageActions.addMessage(message, messageOptions);
			})
			.catch(res => {
				let r = JSON.parse(res.response);
				let message = new Message(t(r.code), messageOptions);
				MessageActions.addMessage(message);
			});
	},

	onInputChanged (event) {
		let newState = {};
		newState[event.target.name] = event.target.value;
		let tmp = Object.assign(this.state.fieldValues, newState);
		this.setState({
			fieldValues: tmp
		});
		this.setState({
			submitEnabled: (this.refs.email.getDOMNode().value.trim().length > 0)
		});
	},

	renderInputs () {
		return FIELDS[this.props.param].map(fieldConfig => {
			return (<input type={fieldConfig.type}
							ref={fieldConfig.ref}
							name={fieldConfig.ref}
							placeholder={fieldConfig.ref}
							onChange={this.onInputChanged}
							defaultValue='' />);
		});
	},

	render () {

		let buttonLabel = t(this.props.param === 'password' ? 'recoverpassword' : 'recoverusername');
		let cssClasses = ['tiny small-12 columns'];

		let submitEnabled = this.state.submitEnabled;
		if (!submitEnabled) {
			cssClasses.push('disabled');
		}

		return (
			<div className="row">
				<form className="login-form large-6 large-centered columns" onSubmit={this.handleSubmit}>
					<fieldset>
						<legend>Recover {this.props.param}</legend>
						{this.renderInputs()}
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
