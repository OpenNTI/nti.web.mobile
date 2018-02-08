import React from 'react';
import {scoped} from 'nti-lib-locale';

const t = scoped('common.comingSoon');

export default function Unknown () {
	return (
		<div className="unknown part">
			<h4>{t('singular', {subject: 'This question type'})}</h4>
		</div>
	);
}
