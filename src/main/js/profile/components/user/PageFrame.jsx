import React from 'react';

import LogoutButton from 'login/components/LogoutButton';

import FollowButton from './FollowButton';
// import EditButton from './EditButton';

import ActiveLink from 'common/components/ActiveLink';
import DisplayName from 'common/components/DisplayName';
import Gradient from 'common/components/GradientBackground';

import Page from 'common/components/Page';

import {getAppUsername} from 'common/utils';

import Head from './Head';

export default React.createClass({
	displayName: 'profile:Page',

	propTypes: {
		pageContent: React.PropTypes.any,

		username: React.PropTypes.string
	},

	render () {
		let {username, pageContent = 'div'} = this.props;
		let me = username === getAppUsername();

		let Content = pageContent;

		return (
			<Page title="Profile">
				<Gradient className="profile-wrapper">
					<div className="profile-top-controls">
						<ul className="profile-top-controls-breadcrumb">
							<li>People</li>
							<li><DisplayName username={username}/></li>
						</ul>
						<ul className="profile-top-controls-buttons">
							{me && <li><LogoutButton/></li>}
							<li>{me ? null : <FollowButton />}</li>
						</ul>
					</div>
					<div className="profile">
						<Head {...this.props}>
							<ul className="profile-nav">
								<li className="profile-nav-item"><ActiveLink href="/about/">About</ActiveLink></li>
								<li className="profile-nav-item"><ActiveLink href="/activity/">Activity</ActiveLink></li>
								<li className="profile-nav-item"><ActiveLink href="/memberships/">Memberships</ActiveLink></li>
								{/*<li className="profile-nav-item"><ActiveLink href="/achievements/">Achievements</ActiveLink></li>*/}
							</ul>
						</Head>
						<Content {...this.props}/>
					</div>
				</Gradient>
			</Page>
		);
	}
});
