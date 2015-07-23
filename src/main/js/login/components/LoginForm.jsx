import React from 'react';

import Conditional from 'common/components/Conditional';
import Loading from 'common/components/TinyLoader';

import StoreEvents from 'common/mixins/StoreEvents';

import {scoped} from 'common/locale';

import OAuthButtons from './OAuthButtons';
import RecoveryLinks from './RecoveryLinks';


import {
	LINK_ACCOUNT_CREATE,
	MESSAGE_SIGNUP_CONFIRMATION
} from '../Constants';

import Store from '../Store';

import {updateWithNewUsername, login} from '../Actions';

const UPDATE_DELAY = Symbol();
const UPDATE_DELAY_TIME = 150;

let t = scoped('LOGIN');

export default React.createClass({
	displayName: 'LoginForm',
	mixins: [StoreEvents],

	backingStore: Store,
	backingStoreEventHandlers: {
		default () {
			if (this.isMounted()) {
				this.forceUpdate();
			}
		}
	},


	signupLink () {
		// if we have a confirmation message show the confirmation view, otherwise go directly to signup
		return t(MESSAGE_SIGNUP_CONFIRMATION, {fallback: 'missing'}) === 'missing' ? '/signup/' : '/signup/confirm';
	},


	setError (error) {
		console.error(error);
		this.setState({error});
	},


	componentDidMount () {
		this.updateUsername();
		let f = React.findDOMNode(this.refs.username);
		if (f) {
			f.focus();
		}
	},


	formatError (error) {
		let message = t(`LOGIN_ERROR.${error.statusCode}`, {fallback: 'missing'});

		if (message === 'missing') {
			message = 'Unknown error';
			console.error('Unknown error: %o', error);
		}

		return message;
	},


	render () {
		let {blankPassword, busy, error} = this.state || {};

		let disabled = busy || blankPassword || !Store.getLoginLink();

		return (
			<div className="login-wrapper">
				<form ref="form" className="login-form" onSubmit={this.handleSubmit} noValidate>
					<div className="header">next thought</div>
					{error && ( <div className="message">{this.formatError(error)}</div>)}
					<fieldset>
						<div className="field-container" data-title="Username">
							<input ref="username"
								name="username"
								type="text"
								placeholder="Username"
								autoCorrect="off"
								autoCapitalize="off"
								tabIndex="1"
								ariaLabel="Username"
								auto=""
								onChange={this.updateUsername}/>
						</div>
						<div className="field-container" data-title="Password">
							<input ref="password"
								name="password"
								type="password"
								autoComplete="off"
								placeholder="Password"
								tabIndex="2"
								ariaLabel="Password"
								onChange={this.updatePassword}/>
						</div>

						<div className="submit-row">
							<button id="login:rel:password" type="submit" disabled={disabled}>
								{ busy ? ( <Loading/> ) : t('login') }
							</button>
						</div>

						<OAuthButtons />

						<Conditional className="account-creation" condition={!!Store.getLink(LINK_ACCOUNT_CREATE)}>
							<a id="login:signup" href={this.signupLink()}>{t('signup.link')}</a>
						</Conditional>
					</fieldset>

					<RecoveryLinks />
				</form>

				<div className="links">
					<a href="http://nextthought.com" id="about" title="About" target="_blank" tabIndex="9">About</a>
					<a href="mailto:support@nextthought.com" id="help" title="Contact Support" target="_blank" tabIndex="10">Help</a>
					<a href="https://docs.google.com/document/pub?id=1rM40we-bbPNvq8xivEKhkoLE7wmIETmO4kerCYmtISM" target="_blank" title="NextThought Terms of Service and User Agreements" tabIndex="11">Terms</a>
					<a href="https://docs.google.com/document/pub?id=1W9R8s1jIHWTp38gvacXOStsfmUz5TjyDYYy3CVJ2SmM" target="_blank" title="Learn about your privacy and NextThought" className="privacy" tabIndex="12">Privacy</a>
				</div>
			</div>
		);
	},


	handleSubmit (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		let {username, password} = React.findDOMNode(this.refs.form).elements;

		this.setState({busy: true}, () => {

			this.updateUsername()
				.then(()=> login(username.value, password.value))
				.catch(error => this.setState({busy: false, error}));
		});
	},


	updatePassword (e) {
		let password = (e ? e.target : React.findDOMNode(this.refs.password)).value;
		let empty = (!password || password === '');
		this.setState({blankPassword: empty});
	},


	updateUsername (e) {
		let username = (e ? e.target : React.findDOMNode(this.refs.username)).value;

		clearTimeout(this[UPDATE_DELAY]);

		let coordinator = new Promise((done, canceled) => {
			let timeout = setTimeout(canceled, UPDATE_DELAY_TIME + 10);
			this[UPDATE_DELAY] = setTimeout(()=> {
				clearTimeout(timeout);

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
