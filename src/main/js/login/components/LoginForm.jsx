import React from 'react';

import Conditional from 'common/components/Conditional';

import StoreEvents from 'common/mixins/StoreEvents';

import {scoped} from 'common/locale';

import OAuthButtons from './OAuthButtons';
import RecoveryLinks from './RecoveryLinks';


import {
	LINK_ACCOUNT_CREATE,
	MESSAGE_SIGNUP_CONFIRMATION
} from '../Constants';

import Store from '../Store';

import {updateWithNewUsername} from '../Actions';

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

	getInitialState () {
		return {
			username: '',
			password: ''
		};
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
		let f = React.findDOMNode(this.refs.username);
		if (f) {
			f.focus();
		}
	},


	render () {
		return (
			<div className="login-wrapper">
				<form ref="form" className="login-form" onSubmit={this.handleSubmit} noValidate>
					<div className="header">next thought</div>
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
								ariaLabel="Password"/>
						</div>

						<div className="submit-row">
							<button id="login:rel:password" type="submit">{t('login')}</button>
						</div>

						<OAuthButtons links={this.state.links} />

						<Conditional className="account-creation" condition={!!Store.getLink(LINK_ACCOUNT_CREATE)}>
							<a id="login:signup" href={this.signupLink()}>{t('signup.link')}</a>
						</Conditional>
					</fieldset>

					<RecoveryLinks links={this.state.links} />
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


		return false;
	},


	updateUsername (e) {
		let username = e.target.value;

		clearTimeout(this[UPDATE_DELAY]);

		this[UPDATE_DELAY] = setTimeout(()=> {

			this.inflightUpdate = updateWithNewUsername(username)
				.catch(er => this.setError(er))
				.then(() => delete this.inflightUpdate);

		}, UPDATE_DELAY_TIME);
	}
});
