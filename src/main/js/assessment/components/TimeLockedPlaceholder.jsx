import React from 'react';
import PropTypes from 'prop-types';

import Placeholder from './Placeholder';

export default class extends React.Component {
	static displayName = 'TimeLockedPlaceholder';

	static propTypes = {
		assignment: PropTypes.object
	};

	onBack = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//Temp:
		global.history.go(-1);
	};

	render () {
		const {props:{assignment}} = this;
		const props = {
			assignment,
			message: 'This assignment has not opened yet. Come back later.',
			buttonLabel: 'Back',
			pageTitle: 'Not Available Yet',
			onConfirm: this.onBack
		};

		return (
			<Placeholder {...props} />
		);
	}
}
