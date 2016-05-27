import React from 'react';
import Url from 'url';

import {Error, Loading, Mixins} from 'nti-web-commons';

import Messages from 'common/utils/WindowMessageListener';

import {getAppUser, getReturnURL} from 'nti-web-client';


function getData ({data}) {
	try {
		return JSON.parse(data);
	} catch (e) {
		//don't care
	}
	return {};
}


export default React.createClass({
	displayName: 'RegistrationSurveyView',
	mixins: [Mixins.BasePath],

	componentWillMount () { //constructor
		this.METHODS = {
			['survey-complete']: () => {
				location.replace(getReturnURL() || this.getBasePath());
			},

			resize: ({value}) => {
				this.setState({height: value});
			}
		};

		this.setState({busy: true});
	},


	componentDidMount () {
		Messages.add(this.onMessage);
		return getAppUser()
			.then(u => u.getLink('RegistrationSurvey') || Promise.reject('No Link'))
			.then(link => Url.resolve(location.href, link))
			.then(src => this.setState({src}))
			.catch(error => this.setState({error}))
			.then(() => this.setState({busy: false}));
	},


	componentWillUnmount () {
		Messages.remove(this.onMessage);
	},


	getInitialState () {
		return {};
	},


	onMessage (e) {
		const data = getData(e);
		const {src} = this.state;
		const method = this.METHODS[data.method];

		if (data.id === src && typeof method === 'function') {
			method(data);
		}
	},


	render () {
		const {state: {error, busy, src, height = 0}} = this;

		return error ? (
			<Error error={error}/>
		) : busy ? (
			<Loading />
		) : (
			<div className="logon-action-survey-wrapper">
				<header>
					<h3>Registration Survey</h3>
					<div className="subtext"/>
				</header>
				<iframe src={src} height={height} frameBorder="no" scrolling="no" allowTransparency="true" seamless/>
			</div>
		);
	}
});
