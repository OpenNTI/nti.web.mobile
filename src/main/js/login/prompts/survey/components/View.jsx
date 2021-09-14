import './View.scss';

import React from 'react';
import createReactClass from 'create-react-class';

import { url } from '@nti/lib-commons';
import { Error, Loading, Mixins } from '@nti/web-commons';
import { WindowMessageListener as Messages } from '@nti/lib-dom';
import { getAppUser, getReturnURL } from '@nti/web-client';

function getData({ data }) {
	try {
		return JSON.parse(data);
	} catch (e) {
		//don't care
	}
	return {};
}

export default createReactClass({
	displayName: 'RegistrationSurveyView',
	mixins: [Mixins.BasePath],

	componentDidMount() {
		//constructor
		this.METHODS = {
			['survey-complete']: () => {
				global.location.replace(getReturnURL() || this.getBasePath());
			},

			resize: ({ value }) => {
				this.setState({ height: value });
			},
		};

		this.setState({ busy: true });

		Messages.add(this.onMessage);
		return getAppUser()
			.then(
				u =>
					u.getLink('RegistrationSurvey') ||
					Promise.reject(new Error('No Link'))
			)
			.then(link => url.resolve(global.location.href, link))
			.then(src => this.setState({ src }))
			.catch(error => this.setState({ error }))
			.then(() => this.setState({ busy: false }));
	},

	componentWillUnmount() {
		Messages.remove(this.onMessage);
	},

	getInitialState() {
		return {};
	},

	onMessage(e) {
		const data = getData(e);
		const { src } = this.state;
		const method = this.METHODS[data.method];

		if (data.id === src && typeof method === 'function') {
			method(data);
		}
	},

	render() {
		const {
			state: { error, busy, src, height = 0 },
		} = this;

		return error ? (
			<Error error={error} />
		) : busy ? (
			<Loading.Mask />
		) : (
			<div className="logon-action-survey-wrapper">
				<header>
					<h3>Registration Survey</h3>
					<div className="subtext" />
				</header>
				<iframe
					src={src}
					height={height}
					frameBorder="no"
					scrolling="no"
					seamless
				/>
			</div>
		);
	},
});
