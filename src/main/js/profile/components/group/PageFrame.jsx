import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { ActiveLink, Background } from '@nti/web-commons';
import Page from 'internal/common/components/Page';
import ContextSender from 'internal/common/mixins/ContextSender';

import GroupControls from './Controls';
import Breadcrumb from './Breadcrumb';
import Head from './Head';

export default createReactClass({
	displayName: 'Group:Page',
	mixins: [ContextSender],

	propTypes: {
		pageContent: PropTypes.any,
		entity: PropTypes.object.isRequired,
	},

	render() {
		let { entity, pageContent = 'div' } = this.props;

		let Content = pageContent;

		return (
			<Page title="Group">
				<Background
					className="profile-wrapper group"
					imgUrl={entity.backgroundURL}
				>
					<div className="profile-top-controls">
						<Breadcrumb entity={entity} />
						<ul className="profile-top-controls-buttons">
							<li>
								<GroupControls entity={entity} />
							</li>
						</ul>
					</div>
					<div className="profile">
						<Head {...this.props}>
							<ul className="profile-nav">
								<li className="profile-nav-item">
									<ActiveLink href="/activity/">
										Activity
									</ActiveLink>
								</li>
								<li className="profile-nav-item">
									<ActiveLink href="/members/">
										Members
									</ActiveLink>
								</li>
								{/*<li className="profile-nav-item"><ActiveLink href="/events/">Events</ActiveLink></li>*/}
							</ul>
						</Head>
						<Content {...this.props} />
					</div>
				</Background>
			</Page>
		);
	},
});
