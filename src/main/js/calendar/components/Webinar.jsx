import React from 'react';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';
import {decodeFromURI} from '@nti/lib-ntiids';
import {GotoWebinar} from '@nti/web-integrations';

import Redirect from 'navigation/components/Redirect';

export default class WebinarView extends React.Component {
	static propTypes = {
		webinarId: PropTypes.string
	}

	componentDidMount () {
		this.loadWebinar();
	}

	async loadWebinar () {
		const {webinarId} = this.props;

		const service = await getService();
		const webinar = await service.getObject(decodeFromURI(webinarId));

		this.setState({webinar});
	}

	state = {}

	render () {
		const {webinar, close} = this.state;

		if(close) {
			return <Redirect location="/calendar"/>;
		}
		else if(webinar) {
			if(webinar.hasLink('WebinarRegister')) {
				return <GotoWebinar.Registration item={{webinar}} onBeforeDismiss={() => {this.setState({close: true});}}/>;
			}
		}

		return null;
	}
}
