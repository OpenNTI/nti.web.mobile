import React from 'react';
import cx from 'classnames';

import {getAppUser, getReturnURL} from 'common/utils';

import UserAgreement from './UserAgreement';

export default React.createClass({
	displayName: 'TermsOfServiceAcceptence',

	getInitialState () {
		return {};
	},


	onCheckChanged (e) {
		this.setState({agree: e.target.checked});
	},


	acceptTermsOfService () {
		if (!this.state.agree) { return; }

		this.setState({busy: true});

		getAppUser()
			// .then(u => u.acceptTermsOfService())
			.catch(e => console.error(e.stack || e.message || e))
			.then(()=> location.replace(getReturnURL()));
	},


	render () {
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
						<input type="checkbox" checked={agree} onChange={this.onCheckChanged}/> Yes, I agree to the Terms of Service and Privacy Policy.
					</label>
					<button className={cx({disabled})} disabled={disabled} onClick={this.acceptTermsOfService}>I Agree</button>
				</footer>
			</div>
		);
	}
});
