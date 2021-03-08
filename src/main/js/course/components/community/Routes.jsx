import React from 'react';
import PropTypes from 'prop-types';
import Router from 'react-router-component';

import Redirect from 'internal/navigation/components/Redirect';

import Community from './View';

export default class MobileCourseCommunityRoutes extends React.Component {
	static propTypes = {
		course: PropTypes.shape({
			hasCommunity: PropTypes.func,
		}),
	};

	render() {
		const { course } = this.props;

		if (!course || !course.hasCommunity()) {
			return <Redirect location="/" />;
		}

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
