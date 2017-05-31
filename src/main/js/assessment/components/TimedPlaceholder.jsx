import PropTypes from 'prop-types';
import React from 'react';
import Placeholder from './Placeholder';

export default class extends React.Component {
    static displayName = 'TimedPlaceholder';

    static propTypes = {
		assignment: PropTypes.object
	};

    onStart = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//Temp:
		history.go(-1);
	};

    render() {
		//You have <strong>5 minutes</strong> to complete this Timed Assignment.
		//<span className="red">Once you've started, the timer will not stop.</span>
		let {assignment} = this.props;

		let props = {
			assignment: assignment,
			message: 'Timed assignments are currently not supported on the mobile app.',
			buttonLabel: 'Back',
			pageTitle: 'Timed Assignment',
			onConfirm: this.onStart
		};

		return (
			<Placeholder {...props} />
		);
	}
}
