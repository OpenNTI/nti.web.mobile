import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Placeholder from './Placeholder';

const t = scoped('mobile.assessment.components.TimeLockedPlaceholder', {
	header: 'Timed Assignment',
	message: 'Timed assignments are currently not supported on the mobile app.'
});

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
		global.history.go(-1);
	};

	render () {
		//You have <strong>5 minutes</strong> to complete this Timed Assignment.
		//<span className="red">Once you've started, the timer will not stop.</span>
		let {assignment} = this.props;

		let props = {
			assignment: assignment,
			message: t('message'),
			buttonLabel: 'Back',
			pageTitle: t('header'),
			onConfirm: this.onStart
		};

		return (
			<Placeholder {...props} />
		);
	}
}
