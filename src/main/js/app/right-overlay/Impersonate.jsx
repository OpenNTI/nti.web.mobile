import './Impersonate.scss';

import React from 'react';

import { getAppUser } from '@nti/web-client';

const isNextThoughtAccount = RegExp.prototype.test.bind(/@nextthought\.com$/);
const LINK = 'logon.nti.impersonate';

export default class Impersonate extends React.Component {
	state = {};

	async componentDidMount() {
		const user = await getAppUser();
		this.setState({ user });
	}

	componentWillUnmount() {
		this.setState = () => {};
	}

	onClick = e => {
		e.preventDefault();
		e.stopPropagation();

		let link = this.state.user.getLink(LINK);
		let username =
			link && prompt('What username do you want to impersonate?');

		if (username) {
			let url = new URL(link, global.location);
			url.searchParams.set('username', username);
			url.searchParams.set('success', global.location.pathname);

			global.location.replace(url.toString());
		}
	};

	render() {
		let {
			state: { user },
		} = this;
		if (
			!user ||
			!user.getLink(LINK) ||
			!isNextThoughtAccount(user.getID())
		) {
			return null;
		}

		return (
			<a href="#" className="button impersonate" onClick={this.onClick}>
				Impersonate
			</a>
		);
	}
}
