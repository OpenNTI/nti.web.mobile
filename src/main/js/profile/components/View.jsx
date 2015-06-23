import React from 'react/addons';

import {Locations, Location} from 'react-router-component';
import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import Activity from './Activity';
import Achievements from './Achievements';
import About from './About';
import ActiveLink from 'forums/components/ActiveLink';
import LogoutButton from 'login/components/LogoutButton';
import {getAppUsername} from 'common/utils';

import NavigationBar from 'navigation/components/Bar';

import Gradient from 'common/components/GradientBackground';
import Head from './Head';

import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {resolve} from 'common/components/DisplayName';

export default React.createClass({
	displayName: 'profile:View',
	mixins: [BasePathAware, ContextSender, NavigatableMixin],

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
		let {username} = this.props;
		username = decodeURIComponent(username);
		let me = username === getAppUsername();
		return (
			<div>
				<NavigationBar title="Profile" />
				<Gradient className="profile">
					<Head {...this.props} />
					<ul className="profile-nav">
						<li className="profile-nav-item"><ActiveLink href={this.makeHref('/about/', true)}>About</ActiveLink></li>
						<li className="profile-nav-item"><ActiveLink href={this.makeHref('/activity/', true)}>Activity</ActiveLink></li>
						<li className="profile-nav-item"><ActiveLink href={this.makeHref('/achievements/', true)}>Achievements</ActiveLink></li>
					</ul>
					<Locations contextual ref="router">
						<Location
							path="/activity/"
							handler={Activity}
						/>
						<Location
							path="/achievements/"
							handler={Achievements}
						/>
						<Location
							path="*"
							handler={About}
						/>
					</Locations>
					<ul className="actions">
						{me && <li><LogoutButton/></li>}
					</ul>
				</Gradient>
			</div>
		);
	}
});
