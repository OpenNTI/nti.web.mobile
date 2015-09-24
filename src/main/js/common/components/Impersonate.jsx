import React from 'react';

import QueryString from 'query-string';
import Url from 'url';

const isNextThoughtAccount = RegExp.prototype.test.bind(/@nextthought\.com$/);
const LINK = 'logon.nti.impersonate';

import {getAppUser} from '../utils';

export default React.createClass({
	displayName: 'Impersonate',


	getInitialState () {
		return {};
	},


	componentWillMount () {
		getAppUser().then(user => this.setState({user}));
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		let link = this.state.user.getLink(LINK);
		let username = link && prompt('What username do you want to impersonate?');

		if (username) {

			let url = Url.parse(link);
			url.search = QueryString.stringify(
							Object.assign(
								QueryString.parse(url.search),
								{
									username,
									success: location.pathname
								}));



			location.replace(url.format());
		}
	},


	render () {
		let {state: {user}} = this;
		if (!user || !user.getLink(LINK) || !isNextThoughtAccount(user.getID())) {
			return null;
		}

		return (
			<a href="#" className="button impersonate" onClick={this.onClick}>Impersonate</a>
		);
	}
});
