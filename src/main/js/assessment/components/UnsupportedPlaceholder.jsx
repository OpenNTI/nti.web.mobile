import React from 'react';
import PropTypes from 'prop-types';

import Placeholder from './Placeholder';

export default class extends React.Component {
	static displayName = 'UnSupprtedPlaceholder';

	static propTypes = {
		assignment: PropTypes.object,
	};

	onBack = e => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//Temp:
		global.history.go(-1);
	};

	render() {
		//You have <strong>5 minutes</strong> to complete this Timed Assignment.
		//<span className="red">Once you've started, the timer will not stop.</span>
		let { assignment } = this.props;

		let props = {
			assignment,
			message: 'Assignments are not supported on this platform.',
			buttonLabel: 'Back',
			pageTitle: 'Not Supported',
			onConfirm: this.onBack,
		};

		return <Placeholder {...props} />;
	}
}
