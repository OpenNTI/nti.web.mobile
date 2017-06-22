import React from 'react';
import {scoped} from 'nti-lib-locale';

const t = scoped('COURSE.INFO');

export default function OpenEnrolledMessage () {
	return (
		<div className="open">
			{t('OpenEnrolled')} <span className="red">{t('OpenEnrolledIsNotForCredit')}</span>
		</div>
	);
}
