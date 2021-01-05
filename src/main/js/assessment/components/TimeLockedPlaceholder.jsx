import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Placeholder from './Placeholder';

const t = scoped('mobile.assessment.components.TimeLockedPlaceholder', {
	header: 'Currently Unavailable',
	date: 'Your assignment will be available on %(date)s.',
	noDate: 'This assignment has not opened yet. Come back later.'
});

TimeLockedPlaceholder.propTypes = {
	assignment: PropTypes.object
};

export default function TimeLockedPlaceholder ({assignment}) {

	const onConfirm = React.useCallback((e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//Temp:
		global.history.go(-1);
	}, []);

	const available = assignment.getAvailableForSubmissionBeginning();
	const date = available && DateTime.format(available, DateTime.WEEKDAY_MONTH_NAME_DAY_AT_TIME_WITH_ZONE);

	return (
		<Placeholder
			assignment={assignment}
			buttonLabel={'Back'}
			message={date ? t('date', {date}) : t('noDate')}
			onConfirm={onConfirm}
			pageTitle={t('header')}
		/>
	);
}
