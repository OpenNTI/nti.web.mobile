


var Store = require('../Store');
var LoginStoreProperties = require('../StoreProperties');
var Actions = require('../Actions');
var OAuthButtons = require('./OAuthButtons');
var RecoveryLinks = require('./RecoveryLinks');
var t = require('common/locale').scoped('LOGIN');
var React = require('react');
var Constants = require('../Constants');
var Link = require('react-router-component').Link;

var _pingDelayMs = 1000; // how long to buffer user input before sending another dataserver ping request.

var View = React.createClass({

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
		Store.addChangeListener(this._onLoginStoreChange);
		Actions.clearErrors({category: Constants.messages.category});
	},


	componentDidUpdate: function() {
		var name = this._username();
		if (name && !this.state.timeoutId) {
			this._usernameChanged();
		}
	},


	componentWillUnmount: function() {
		console.log('LoginView::componentWillUnmount');
		Store.removeChangeListener(this._onLoginStoreChange);
		Actions.clearErrors();
		delete this.state.password;
	},


	_signupLink: function() {
		// if we have a confirmation message show the confirmation view, otherwise go directly to signup
		return t(Constants.messages.SIGNUP_CONFIRMATION, {fallback: 'missing'}) === 'missing' ? '/signup/' : '/signup/confirm';
	},


	render: function() {
		var submitEnabled = this.state.submitEnabled;
		var signupLink = this._signupLink();

		var fields = Store.loginFormFields().map(function(fieldConfig) {
			return (
				<input type={fieldConfig.type}
						ref={fieldConfig.ref}
						name={fieldConfig.ref}
						autoCapitalize={false}
						autoCorrect={false}
						placeholder={fieldConfig.placeholder}
						defaultValue={this.state[fieldConfig.ref]}
						onChange={this._inputChanged} />
			);
		}.bind(this));

		return (

			<div className="row">
				<form className="login-form medium-6 medium-centered columns" onSubmit={this._handleSubmit} noValidate>

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
							<Link id="login:signup" href={signupLink}>{t('signup.link')}</Link>
						</div>

					</fieldset>

					<RecoveryLinks links={this.state.links} />

				</form>
			</div>

		);
	},


	_inputChanged: function(event) {
		switch(event.target.name) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case 'username':
				this._usernameChanged(event);
			break;

			case 'password':
				this._passwordChanged(event);
			break;
		}
	},


	/**
	 * onChange handler for the username field. Triggers Actions.userInputChanged
	 */
	_usernameChanged: function() {
		clearTimeout(this.state.timeoutId);
		var timeoutId = global.setTimeout(()=>{
			console.log('timeout, firing userInputChanged: username: %s', this._username());
			Actions.userInputChanged({
					credentials: {
						username: this._username(),
						password: this._password()
					}
				});
		},
		_pingDelayMs);

		this.setState({timeoutId: timeoutId});
	},


	_passwordChanged: function(/*event*/) {
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
