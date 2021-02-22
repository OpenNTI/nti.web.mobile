import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import Placeholder from './Placeholder';

const t = scoped('mobile.assessment.components.TimedPlaceholder', {
	header: 'Timed Assignment',
	message: 'Timed assignments are currently not supported on the mobile app.',
});

TimedPlaceholder.propTypes = {
	assignment: PropTypes.object,
};

export default function TimedPlaceholder({ assignment }) {
	const onConfirm = React.useCallback(e => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//Temp:
		global.history.go(-1);
	}, []);

	//You have <strong>5 minutes</strong> to complete this Timed Assignment.
	//<span className="red">Once you've started, the timer will not stop.</span>

	return (
		<Placeholder
			assignment={assignment}
			buttonLabel="Back"
			message={t('message')}
			onConfirm={onConfirm}
			pageTitle={t('header')}
		/>
	);
}
