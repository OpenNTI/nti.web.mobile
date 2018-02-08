import React from 'react';
import {scoped} from 'nti-lib-locale';

const t = scoped('course.info', {
	OpenEnrolled: 'You\'re registered for the open course.',
	OpenEnrolledIsNotForCredit: '(No Credit)',
});

export default function OpenEnrolledMessage () {
	return (
		<div className="open">
			{t('OpenEnrolled')} <span className="red">{t('OpenEnrolledIsNotForCredit')}</span>
		</div>
	);
}
