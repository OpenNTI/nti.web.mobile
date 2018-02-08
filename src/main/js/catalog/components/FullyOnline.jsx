import React from 'react';
import {scoped} from 'nti-lib-locale';

const t = scoped('course.info', {
	OnlyOnline: 'Fully Online',
});

export default function FullyOnline () {
	return (<div className="value">{t('OnlyOnline')}</div>);
}
