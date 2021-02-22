import PropTypes from 'prop-types';
import React from 'react';

import { activateNavigationGuard, deactivateNavigationGuard } from '../Actions';

export default class extends React.Component {
	static displayName = 'NavigationGuard';

	static propTypes = {
		message: PropTypes.string,
	};

	componentDidMount() {
		activateNavigationGuard(() => this.props.message);
	}

	componentWillUnmount() {
		deactivateNavigationGuard();
	}

	render() {
		return null;
	}
}
