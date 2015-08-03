import React from 'react';

import {activateNavigationGuard, deactivateNavigationGuard} from '../Actions';

export default React.createClass({
	displayName: 'NavigationGuard',

	propTypes: {
		message: React.PropTypes.string
	},

	componentDidMount () {
		activateNavigationGuard(()=> this.props.message);
	},


	componentWillUnmount () {
		deactivateNavigationGuard();
	},


	render () {
		return null;
	}
});
