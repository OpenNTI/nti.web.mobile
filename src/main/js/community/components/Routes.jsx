import React from 'react';
import Router from 'react-router-component';

import Community from './View';

export default class MobileCommunityRoutes extends React.Component {
	render() {
		return (
			<Router.Locations contextual identifier="community-router">
				<Router.Location
					path="/:channel/:channelTopic(/*)"
					handler={Community}
					{...this.props}
				/>
				<Router.Location
					path="/:channel(/*)"
					handler={Community}
					{...this.props}
				/>
				<Router.Location path="/" handler={Community} {...this.props} />
			</Router.Locations>
		);
	}
}
