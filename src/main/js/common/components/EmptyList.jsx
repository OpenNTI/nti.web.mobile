import React from 'react';

import Notice from './Notice';

import {scoped} from '../locale';

const t = scoped('FILTER');

export default React.createClass({
	displayName: 'EmptyList',

	render () {
		return (
			<Notice>{t('emptyList')}</Notice>
		);
	}

});
