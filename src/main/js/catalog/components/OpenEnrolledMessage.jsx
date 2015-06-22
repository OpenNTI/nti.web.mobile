import React from 'react';

import {scoped} from 'common/locale';

const t = scoped('COURSE.INFO');

export default React.createClass({
	displayName: 'OpenEnrolledMessage',

	render () {
		return (
			<div className="open">
				{t('OpenEnrolled')} <span className="red">{t('OpenEnrolledIsNotForCredit')}</span>
			</div>
		);
	}
});
