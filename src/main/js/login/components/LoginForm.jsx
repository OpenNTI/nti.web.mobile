import React from 'react';
import QueryString from 'query-string';

import {Link} from 'react-router-component';

import Conditional from 'common/components/Conditional';
import Loading from 'common/components/Loading';

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

const t = scoped('LOGIN');

// if we have a confirmation message show the confirmation view, otherwise go directly to signup
const signupLink = () => t(MESSAGE_SIGNUP_CONFIRMATION, {fallback: 'missing'}) === 'missing'
							? '/signup/'
							: '/signup/confirm';

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


	getInitialState () {
		return {};
	},


	setError (error) {
		console.error(error);
		this.setState({error});
	},


	componentWillMount () {
		if (typeof location !== 'undefined' && location.search) {
			let query = QueryString.parse(location.search);
			if (query.error) {
				this.setError(query.error);
			}
		}
	},


	componentDidMount () {
		this.updateUsername();
		let f = React.findDOMNode(this.refs.username);
		if (f) {
			f.focus();
		}
	},


	formatError (error) {
		let message = typeof error === 'string'
			? error
			: t(`LOGIN_ERROR.${(error || {}).statusCode}`, {fallback: 'missing'});

		if (message === 'missing' && error != null) {
			message = 'Unknown error';
			console.error('Unknown error: %o', error);
		}

		return message;
	},


	render () {
		let {blankPassword, busy, error, username, password} = this.state || {};

		let disabled = busy || blankPassword || !Store.getLoginLink();

		return (
			<div className="login-wrapper">
				<form ref="form" className="login-form" onSubmit={this.handleSubmit} noValidate>
					{busy ? ( <Loading/> ) : (
						<div>
							<div className="header">next thought</div>
							<Conditional condition={error} className="message">{this.formatError(error)}</Conditional>
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
										defaultValue={username}
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
										defaultValue={password}
										onChange={this.updatePassword}/>
								</div>

								<div className="submit-row">
									<button id="login:rel:password" type="submit" disabled={disabled}>
										{t('login')}
									</button>
								</div>

								<OAuthButtons />

								<Conditional className="account-creation" condition={!!Store.getLink(LINK_ACCOUNT_CREATE)}>
									<Link id="login:signup" href={signupLink()}>{t('signup.link')}</Link>
								</Conditional>
							</fieldset>
						</div>)}
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
		let password = (e ? e.target : React.findDOMNode(this.refs.password));
		if (password) {
			password = password.value;
			let empty = (!password || password === '');
			this.setState({blankPassword: empty, password});
		}
	},


	updateUsername (e) {
		let username = (e ? e.target : React.findDOMNode(this.refs.username));

		if (username) { //normal case, we have an element.
			username = username.value; // flatten down to a string.

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
