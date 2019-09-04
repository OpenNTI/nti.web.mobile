import React from 'react';
import Router from 'react-router-component';

import Community from './View';

export default function MobileCommunityRoutes (props) {
	return (
		<Router.Locations contextual identifier="community-router">
			<Router.Location path="/:channel/:channelTopic(/*)" handler={Community} {...props} />
			<Router.Location path="/:channel(/*)" handler={Community} {...props} />
			<Router.Location path="/" handler={Community} {...props} />
		</Router.Locations>
	);
}