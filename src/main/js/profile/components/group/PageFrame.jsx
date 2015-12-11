import React from 'react';

import GroupControls from './Controls';

import ActiveLink from 'common/components/ActiveLink';
import Background from 'common/components/Background';
import Page from 'common/components/Page';
import Breadcrumb from './Breadcrumb';

import ContextSender from 'common/mixins/ContextSender';

import Head from './Head';

export default React.createClass({
	displayName: 'Group:Page',
	mixins: [ContextSender],

	propTypes: {
		pageContent: React.PropTypes.any,
		entity: React.PropTypes.object.isRequired
	},

	render () {
		let {entity, pageContent = 'div'} = this.props;

		let Content = pageContent;

		return (
			<Page title="Group">
				<Background className="profile-wrapper group" imgUrl={entity.backgroundURL}>
					<div className="profile-top-controls">
						<Breadcrumb entity={entity} />
						<ul className="profile-top-controls-buttons">
							<li><GroupControls entity={entity}/></li>
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
				</Background>
			</Page>
		);
	}
});
