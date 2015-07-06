import React from 'react';

import FollowGroup from './GroupFollowButton';
import GroupControls from './GroupControls';

import ActiveLink from 'common/components/ActiveLink';
import Gradient from 'common/components/GradientBackground';
import Page from 'common/components/Page';

import Head from './GroupHead';

export default React.createClass({
	displayName: 'Group:Page',

	propTypes: {
		pageContent: React.PropTypes.any,
		entity: React.PropTypes.object.isRequired
	},

	render () {
		let {entity, pageContent = 'div'} = this.props;

		let Content = pageContent;
		let follows = false;

		return (
			<Page title="Profile">
				<Gradient className="profile-wrapper">
					<div className="profile-top-controls">
						<ul className="profile-top-controls-breadcrumb">
							<li>Groups</li>
							<li>{entity.displayName}</li>
						</ul>
						<ul className="profile-top-controls-buttons">
							<li>{follows ? <GroupControls entity={entity}/> : <FollowGroup entity={entity} />}</li>
						</ul>
					</div>
					<div className="profile">
						<Head {...this.props}>
							<ul className="profile-nav">
								<li className="profile-nav-item"><ActiveLink href="/activity/">Activity</ActiveLink></li>
								<li className="profile-nav-item"><ActiveLink href="/members/">Members</ActiveLink></li>
								{/*<li className="profile-nav-item"><ActiveLink href="/events/">Events</ActiveLink></li>*/}
							</ul>
						</Head>
						<Content {...this.props}/>
					</div>
				</Gradient>
			</Page>
		);
	}
});
