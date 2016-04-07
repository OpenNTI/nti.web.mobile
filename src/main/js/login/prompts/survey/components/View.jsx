import React from 'react';


import Error from 'common/components/Error';
import Loading from 'common/components/Loading';
import Messages from 'common/utils/WindowMessageListener';
import BasePathAware from 'common/mixins/BasePath';

import {getAppUser, getReturnURL} from 'common/utils';


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
	mixins: [BasePathAware],

	componentWillMount () { //constructor
		this.METHODS = {
			['survey-complete']: () => {
				location.replace(getReturnURL() || this.getBasePath());
			}
		};

		this.setState({busy: true});
		Messages.add(this.onMessage);

		return getAppUser()
			.then(u => u.getLink('RegistrationSurvey') || Promise.reject('No Link'))
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
			method();
		}
	},


	render () {
		const {state: {error, busy, src}} = this;

		return error ? (
			<Error error={error}/>
		) : busy ? (
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
