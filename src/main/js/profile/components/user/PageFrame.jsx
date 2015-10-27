import React from 'react';
import {Link} from 'react-router-component';
import FollowButton from './FollowButton';
// import EditButton from './EditButton';

import ActiveState from 'common/components/ActiveState';
import DisplayName from 'common/components/DisplayName';
import Gradient from 'common/components/GradientBackground';

import Page from 'common/components/Page';

import ContextSender from 'common/mixins/ContextSender';

import {getAppUsername} from 'common/utils';

import Head from './Head';

export default React.createClass({
	displayName: 'profile:Page',
	mixins: [ContextSender],

	propTypes: {
		pageContent: React.PropTypes.any,

		entity: React.PropTypes.any
	},

	render () {
		let {entity, pageContent = 'div'} = this.props;
		let me = (typeof entity === 'object' ? entity.getID() : entity) === getAppUsername();

		let Content = pageContent;

		return (
			<Page title="Profile">
				<Gradient className="profile-wrapper">
					<div className="profile-top-controls">
						<ul className="profile-top-controls-breadcrumb">
							<li>People</li>
							<li><DisplayName entity={entity}/></li>
						</ul>
						<ul className="profile-top-controls-buttons">
							<li>{me ? (
								null
							) : (
								<FollowButton entity={entity} />
							)}</li>
						</ul>
					</div>
					<div className="profile">
						<Head {...this.props}>
							<ul className="profile-nav">
								<li className="profile-nav-item"><ActiveState hasChildren tag={Link} href="/about/">About</ActiveState></li>
								<li className="profile-nav-item"><ActiveState tag={Link} href="/activity/">Activity</ActiveState></li>
								<li className="profile-nav-item"><ActiveState tag={Link} href="/memberships/">Memberships</ActiveState></li>
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
