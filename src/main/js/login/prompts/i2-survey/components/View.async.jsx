import React from 'react';
import cx from 'classnames';

import Logger from 'nti-util-logger';

import {getAppUser, getReturnURL} from 'common/utils';
import BasePathAware from 'common/mixins/BasePath';

const logger = Logger.get('i2-survey:components:View');

export default React.createClass({
	displayName: 'i2-SurveyFrame',

	mixins: [BasePathAware],

	getInitialState () {
		return {
		};
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

				<iframe src={this.getBasePath() + 'onboarding/i2-survey/'} />

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
