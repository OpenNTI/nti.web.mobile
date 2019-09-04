import React from 'react';
import PropTypes from 'prop-types';
import {encodeForURI} from '@nti/lib-ntiids';

import {Component as ContextSender} from 'common/mixins/ContextSender';

export default class CommunityOverridePage extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		channel: PropTypes.object,
		children: PropTypes.any
	}

	static contextTypes = {
		router: PropTypes.object
	}

	static childContextTypes = {
		router: PropTypes.object
	}

	getChildContext () {
		return {
			router: {
				...(this.context.router || {}),
				history: null
			}
		};
	}


	render () {
		const {children} = this.props;

		return (
			<ContextSender getContext={getContext} {...this.props}>
				{children}
			</ContextSender>
		);
	}
}


function getContext () {
	const {channel} = this.props;
	const {router} = this.context;

	const route = router ? router.getRouteFor(channel) : encodeForURI(channel.getID());

	return {
		returnOverride: {
			label: channel.title || '',
			href: route
		}
	};
}