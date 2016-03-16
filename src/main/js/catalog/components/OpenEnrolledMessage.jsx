import React from 'react';

import {scoped} from 'common/locale';

const t = scoped('COURSE.INFO');

export default function OpenEnrolledMessage () {
	return (
		<div className="open">
			{t('OpenEnrolled')} <span className="red">{t('OpenEnrolledIsNotForCredit')}</span>
		</div>
	);
}
