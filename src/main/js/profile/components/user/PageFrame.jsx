import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {getAppUsername} from '@nti/web-client';
import {ActiveState, Background, Flyout} from '@nti/web-commons';

import Page from 'common/components/Page';
import DisplayName from 'common/components/DisplayName';
import ContextSender from 'common/mixins/ContextSender';

// import EditButton from './EditButton';
import FollowButton from './FollowButton';
import Head from './Head';

export default createReactClass({
	displayName: 'profile:Page',
	mixins: [ContextSender],

	propTypes: {
		pageContent: PropTypes.any,

		entity: PropTypes.any
	},

	render () {
		let {entity, pageContent = 'div'} = this.props;
		let me = (typeof entity === 'object' ? entity.getID() : entity) === getAppUsername();

		let Content = pageContent;

		return (
			<Page title="Profile">
				<Background className="profile-wrapper" imgUrl={entity.backgroundURL}>
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
								<li className="profile-nav-item"><ActiveState hasChildren tag="a" href="/about/">About</ActiveState></li>
								<li className="profile-nav-item"><ActiveState tag="a" href="/activity/" hasChildren={/^\/(activity|thoughts)/i}>Activity</ActiveState></li>
								<li className="profile-nav-item"><ActiveState tag="a" href="/memberships/">Memberships</ActiveState></li>
								<li className="profile-nav-item">
									<Flyout.Triggered trigger={(<a href="#" className="profile-nav-more-trigger">&middot;&middot;&middot;</a>)} verticalAlign={Flyout.ALIGNMENTS.BOTTOM} horizontalAlign={Flyout.ALIGNMENTS.RIGHT} arrow dark>
										<ul className="profile-nav-sub-items">
											<ul className="profile-nav-sub-items">
												<li className="profile-nav-item"><ActiveState tag="a" href="/achievements/">Achievements</ActiveState></li>
											</ul>
											{entity && entity.hasLink && entity.hasLink('transcript') && (
												<li className="profile-nav-item"><ActiveState tag="a" href="/transcripts/">Transcripts</ActiveState></li>
											)}
										</ul>
									</Flyout.Triggered>
								</li>
								{/*<li className="profile-nav-item"><ActiveLink href="/achievements/">Achievements</ActiveLink></li>*/}
							</ul>
						</Head>
						<Content {...this.props}/>
					</div>
				</Background>
			</Page>
		);
	}
});
