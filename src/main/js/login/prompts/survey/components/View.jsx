import React from 'react';

import Logger from 'nti-util-logger';

import Loading from 'common/components/Loading';
import Messages from 'common/utils/WindowMessageListener';

import {getAppUser, getReturnURL} from 'common/utils';

const logger = Logger.get('onboarding:survey:components:View');

export default React.createClass({
	displayName: 'RegistrationSurveyView',

	getInitialState () {
		return {};
	},


	componentWillMount () {
		this.setState({busy: true});
		Messages.add(this.onMessage);

		return getAppUser()
			.then(u => u.getLink('i2SurveySource'))
			.then(src => this.setState({src}))
			.catch(e => logger.error(e.stack || e.message || e))
			.then(() => this.setState({busy: false}));
	},


	componentWillUnmount () {
		Messages.remove(this.onMessage);
	},


	onMessage (...args) {
		logger.debug('Window Message:',...args);
	},


	render () {
		const {state: {busy, src}} = this;


		return busy ? (
			<Loading />
		) : (
			<div className="logon-action-survey-wrapper">
				<header>
					<h3>Would you like to take a Survey?!</h3>
					<div className="subtext">:)</div>
				</header>
				<iframe src={src} />
			</div>
		);
	}
});
