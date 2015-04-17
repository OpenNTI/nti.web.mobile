


import Store from '../Store';
import LoginStoreProperties from '../StoreProperties';
import OAuthButtons from './OAuthButtons';
import RecoveryLinks from './RecoveryLinks';
import React from 'react';
import * as Actions from '../Actions';
import * as Constants from '../Constants';
import {Link} from 'react-router-component';
import {scoped} from 'common/locale';
let t = scoped('LOGIN');

const pingDelayMs = 1000; // how long to buffer user input before sending another dataserver ping request.

const handleSubmit = 'LoginForm:handleSubmit';
const inputChanged = 'LoginForm:inputChanged';
const onLoginStoreChange = 'LoginForm:onLoginStoreChange';
const password = 'LoginForm:password';
const passwordChanged = 'LoginForm:passwordChanged';
const signupLink = 'LoginForm:signupLink';
const updateSubmitButton = 'LoginForm:updateSubmitButton';
const username = 'LoginForm:username';
const usernameChanged = 'LoginForm:usernameChanged';


export default React.createClass({

	displayName: 'LoginForm',

	getInitialState: function() {
		return {
			username: '',
			password: '',
			submitEnabled: false,
			timeoutId: null,
			links: {}
		};
	},


	componentDidMount: function() {
		console.log('LoginView::componentDidMount');
		Store.addChangeListener(this[onLoginStoreChange]);
		Actions.clearErrors({category: Constants.messages.category});
	},


	componentDidUpdate: function() {
		let name = this[username]();
		if (name && !this.state.timeoutId) {
			this[usernameChanged]();
		}
	},


	componentWillUnmount: function() {
		console.log('LoginView::componentWillUnmount');
		Store.removeChangeListener(this[onLoginStoreChange]);
		Actions.clearErrors();
		delete this.state.password;
	},


	[signupLink]: function() {
		// if we have a confirmation message show the confirmation view, otherwise go directly to signup
		return t(Constants.messages.SIGNUP_CONFIRMATION, {fallback: 'missing'}) === 'missing' ? '/signup/' : '/signup/confirm';
	},


	render: function() {
		let submitEnabled = this.state.submitEnabled;
		let signup = this[signupLink]();

		let fields = Store.loginFormFields().map(function(fieldConfig) {
			return (
				<input type={fieldConfig.type}
						ref={fieldConfig.ref}
						name={fieldConfig.ref}
						autoCapitalize={false}
						autoCorrect={false}
						placeholder={fieldConfig.placeholder}
						defaultValue={this.state[fieldConfig.ref]}
						onChange={this[inputChanged]} />
			);
		}.bind(this));

		return (

			<div className="row">
				<form className="login-form medium-6 medium-centered columns" onSubmit={this[handleSubmit]} noValidate>

					<fieldset>
						<legend>Sign In</legend>
						{fields}
						<div>
							<button
								id="login:rel:password"
								type="submit"
								className={'small-12 columns tiny ' + (submitEnabled ? '' : 'disabled')}
								disabled={!submitEnabled}
							>{t('login')}</button>
						</div>
						<OAuthButtons links={this.state.links} buttonClass="small-12 columns" />
						<div className="text-center">
							<Link id="login:signup" href={signup}>{t('signup.link')}</Link>
						</div>

					</fieldset>

					<RecoveryLinks links={this.state.links} />

				</form>
			</div>

		);
	},


	[inputChanged]: function(event) {
		switch(event.target.name) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case 'username':
				this[usernameChanged](event);
			break;

			case 'password':
				this[passwordChanged](event);
			break;
		}
	},


	/**
	 * onChange handler for the username field. Triggers Actions.userInputChanged
	 */
	[usernameChanged]: function() {
		clearTimeout(this.state.timeoutId);
		let timeoutId = global.setTimeout(()=>{
			console.log('timeout, firing userInputChanged: username: %s', this[username]());
			Actions.userInputChanged({
					credentials: {
						username: this[username](),
						password: this[password]()
					}
				});
		},
		pingDelayMs);

		this.setState({timeoutId: timeoutId});
	},


	[passwordChanged]: function(/*event*/) {
		this[updateSubmitButton]();
	},


	[handleSubmit]: function(evt) {
		evt.preventDefault();
		console.log('LoginView::_handleSubmit');
		Actions.clearErrors();
		Actions.logIn({
			username: this[username](),
			password: this[password]()
		});
	},


	[username]: function() {
		return this.refs.username.getDOMNode().value.trim();
	},


	[password]: function() {
		return this.refs.password.getDOMNode().value.trim();
	},


	[updateSubmitButton]: function() {
		this.setState({
			submitEnabled:
				this[username]().length > 0 &&
				this[password]().length > 0 &&
				Store.canDoPasswordLogin()
		});
	},


	[onLoginStoreChange]: function(evt) {
		console.log('LoginView::_onLoginStoreChange invoked %O', evt);
		if (this.isMounted()) {
			this[updateSubmitButton]();
		}
		if (evt && evt.property === LoginStoreProperties.links) {
			this.setState({links: evt.value});
		}
	}
});
