import React from 'react/addons';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';

import NavigationBar from 'navigation/components/Bar';

import Head from './Head';

import {resolve} from 'common/components/DisplayName';

export default React.createClass({
	displayName: 'profile:View',
	mixins: [BasePathAware, ContextSender],

	getContext (/*props*/) {
		let path = this.getBasePath();
		return Promise.resolve([
			{
				href: path, label: 'Home'
			}, {
				href: location.href,
				label: 'Profile'
			}
		]);
	},

	componentDidMount () {
		resolve(this, this.props).then(u => console.debug('User: ', u));

		/*
		alias
		firstName
		displayName
		lastName
		realname
		email

		birthdate

		avatarURL
		backgroundURL

		affiliation
		description
		education
		home_page
		interests
		location
		positions
		role

		facebook
		googlePlus
		linkedIn
		twitter
		 */
	},

	render () {
		return (
			<div className="profile">
				<NavigationBar title="Profile" />
				<Head {...this.props} />
			</div>
		);
	}
});
