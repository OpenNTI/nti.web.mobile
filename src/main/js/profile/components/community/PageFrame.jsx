import React from 'react';

import CommunityControls from './HeaderControls';
import CommunityHead from './Head';

import Gradient from 'common/components/GradientBackground';
import Page from 'common/components/Page';

export default React.createClass({
	displayName: 'Community:Page',

	propTypes: {
		pageContent: React.PropTypes.any,
		entity: React.PropTypes.object.isRequired
	},

	render () {
		let {entity, pageContent = 'div'} = this.props;

		let Content = pageContent;

		return (
			<Page title="Profile">
				<Gradient className="community profile-wrapper">
					<div className="profile-top-controls">
						<h1>{entity.displayName}</h1>
						<CommunityControls entity={entity}/>
					</div>
					<div className="profile">
						<CommunityHead entity={entity} />
						<section>
							<Content {...this.props}/>
						</section>
					</div>
				</Gradient>
			</Page>
		);
	}
});
