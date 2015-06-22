import React from 'react';

import {scoped} from 'common/locale';

const t = scoped('COURSE.INFO');

export default React.createClass({
	displayName: 'FullyOnline',

	render () {
		return (<div className="value">{t('OnlyOnline')}</div>);
	}
});
