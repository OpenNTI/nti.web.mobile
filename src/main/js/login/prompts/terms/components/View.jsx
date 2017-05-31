import React from 'react';
import cx from 'classnames';

import Logger from 'nti-util-logger';

import {getAppUser, getReturnURL} from 'nti-web-client';

import UserAgreement from './UserAgreement';

const logger = Logger.get('terms:components:View');

export default class extends React.Component {
    static displayName = 'TermsOfServiceAcceptence';
    state = {};

    onCheckChanged = (e) => {
		this.setState({agree: e.target.checked});
	};

    acceptTermsOfService = () => {
		if (!this.state.agree) { return; }

		this.setState({busy: true});

		getAppUser()
			.then(u => u.acceptTermsOfService())
			.catch(e => logger.error(e.stack || e.message || e))
			.then(()=> location.replace(getReturnURL()));
	};

    render() {
		let {state: {agree}} = this;

		let disabled = !agree;

		return (
			<div className="terms-of-service-prompt">
				<header className="tos-header">
					<h3>We recently updated our Terms of Service and Privacy Policy.</h3>
					<div className="you-should">Please take a moment to read them carefully.</div>
				</header>
				<UserAgreement />
				<footer>
					<label>
						<input type="checkbox" checked={agree} onChange={this.onCheckChanged}/>
						<span> Yes, I agree to the Terms of Service and Privacy Policy.</span>
					</label>
					<button className={cx({disabled})} disabled={disabled} onClick={this.acceptTermsOfService}>I Agree</button>
				</footer>
			</div>
		);
	}
}
