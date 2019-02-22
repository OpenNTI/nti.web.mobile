import React from 'react';
import createReactClass from 'create-react-class';
import QueryString from 'query-string';
import cx from 'classnames';
import {Link} from 'react-router-component';
import Logger from '@nti/util-logger';
import {Loading} from '@nti/web-commons';
import {StoreEventsMixin} from '@nti/lib-store';
import {scoped} from '@nti/lib-locale';

import {
	LINK_ACCOUNT_CREATE,
	MESSAGE_SIGNUP_CONFIRMATION
} from '../Constants';
import Store from '../Store';
import {updateWithNewUsername, login} from '../Actions';

import OAuthButtons from './OAuthButtons';
import RecoveryLinks from './RecoveryLinks';
import SupportLinks from './SupportLinks';

function getWrapper (node) {
	let current = node;

	while (current) {
		if (current.matches('.login-wrapper')) { return current; }

		current = current.parentNode;
	}
}


const logger = Logger.get('login:components:LoginForm');

const UPDATE_DELAY = Symbol();
const UPDATE_DELAY_TIME = 150;

const t = scoped('app.login');

// if we have a confirmation message show the confirmation view, otherwise go directly to signup
const signupLink = () => t(MESSAGE_SIGNUP_CONFIRMATION, {fallback: 'missing'}) === 'missing'
	? '/signup/'
	: '/signup/confirm';

export default createReactClass({
	displayName: 'LoginForm',
	mixins: [StoreEventsMixin],

	backingStore: Store,
	backingStoreEventHandlers: {
		default () {
			this.forceUpdate();
		}
	},

	attachFormRef (el) { this.form = el; },
	attachUsernameInputRef (el) { this.username = el; },
	attachPasswordInputRef (el) { this.password = el; },

	getInitialState () {
		return {};
	},


	setError (error) {
		logger.error(error);
		this.setState({error});
	},


	componentDidMount () {
		const {location} = global;
		if (typeof location !== 'undefined' && location.search) {
			let query = QueryString.parse(location.search);
			if (query.error) {
				this.setError(query.error);
			} else if (query.failed && query.message) {
				this.setError(query.message);
			}
		}

		this.updateUsername();
	},


	formatError (error) {
		let message = typeof error === 'string'
			? error
			: t(`LOGIN_ERROR.${(error || {}).statusCode}`, {fallback: 'missing'});

		if (message === 'missing' && error != null) {
			message = 'Unknown error';
			logger.error('Unknown error: %o', error);
		}

		return message;
	},


	onClick (e) {
		const {clientX, clientY} = e;
		const wrapper = getWrapper(e.target);

		if (!wrapper) { return; }

		const rect = wrapper.getBoundingClientRect();

		if (Math.abs(rect.right - clientX) <= 40 && Math.abs(rect.bottom - clientY) <= 40) {
			this.setState({
				forceNextThoughtLogin: true
			});
		}
	},


	render () {
		const {blankPassword, busy, error, username, password, forceNextThoughtLogin} = this.state || {};

		const disabled = busy || blankPassword || !Store.getLoginLink();
		const hasAccountCreation = !!Store.getLink(LINK_ACCOUNT_CREATE);
		const hasNextThoughtLogin = forceNextThoughtLogin || Store.hasOAuthLinks || hasAccountCreation;

		return (
			<div className={cx('login-wrapper', {'nextthought-login': hasNextThoughtLogin})} onClick={this.onClick}>
				<form ref={this.attachFormRef} className="login-form" onSubmit={this.handleSubmit} noValidate>
					{busy ? ( <Loading.Mask /> ) : (
						<div>
							<div className="header">next thought</div>
							{!!error &&
								<div className="message">{this.formatError(error)}</div>
							}
							<fieldset>
								{hasNextThoughtLogin && (
									<div className="field-container" data-title="Username">
										<input ref={this.attachUsernameInputRef}
											name="username"
											type="text"
											placeholder="Username"
											autoCorrect="off"
											autoCapitalize="off"
											tabIndex="1"
											aria-label="Username"
											autoComplete=""
											defaultValue={username}
											onChange={this.updateUsername}/>
									</div>
								)}
								{hasNextThoughtLogin && (
									<div className="field-container" data-title="Password">
										<input ref={this.attachPasswordInputRef}
											name="password"
											type="password"
											autoComplete="off"
											placeholder="Password"
											tabIndex="2"
											aria-label="Password"
											defaultValue={password}
											onChange={this.updatePassword}/>
									</div>
								)}

								{hasNextThoughtLogin && (
									<div className="submit-row">
										<button id="login:rel:password" type="submit" disabled={disabled}>
											{t('login')}
										</button>
									</div>
								)}

								{!hasNextThoughtLogin && (
									<div className="oauth-header">
										{t('oauth.header')}
									</div>
								)}

								<OAuthButtons />

								{!!Store.getLink(LINK_ACCOUNT_CREATE) && (
									<div className="account-creation">
										<Link id="login:signup" href={signupLink()}>{t('signup.link')}</Link>
									</div>
								)}
							</fieldset>
						</div>
					)}
					{hasNextThoughtLogin && (<RecoveryLinks />)}
				</form>

				<SupportLinks />
			</div>
		);
	},


	handleSubmit (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		let {username, password} = this.form.elements;

		this.setState({busy: true}, () => {
			this.updateUsername()
				.then(()=> login(username.value.trim(), password.value))
				.catch(error => this.setState({busy: false, error}));
		});
	},


	updatePassword (e) {
		let password = (e ? e.target : this.password);
		if (password) {
			password = password.value;
			let empty = (!password || password === '');
			this.setState({blankPassword: empty, password});
		}
	},


	updateUsername (e) {
		let username = (e ? e.target : this.username);

		if (username) { //normal case, we have an element.
			username = username.value.trim(); // flatten down to a string.

		} else if (!e) { // submit case, no element, only state:
			username = this.state.username;
		}

		clearTimeout(this[UPDATE_DELAY]);

		let coordinator = new Promise((done, canceled) => {
			let timeout = setTimeout(canceled, UPDATE_DELAY_TIME + 10);
			this[UPDATE_DELAY] = setTimeout(()=> {
				clearTimeout(timeout);

				this.setState({username});
				this.updatePassword();

				this.inflightUpdate = updateWithNewUsername(username)
					.catch(er => canceled(er) && this.setError(er))
					.then(() => delete this.inflightUpdate)
					.then(done);

			}, UPDATE_DELAY_TIME);

		});

		if (e) { // from an dom event and its not expecting a return value, we need to return nothing.

			//silence unhandled promise rejection warnings.
			//(we don't care in this case, the task was simply interupted)
			coordinator.catch(()=> {});

			return void 0; //true undefined
		}

		return coordinator;
	}
});
