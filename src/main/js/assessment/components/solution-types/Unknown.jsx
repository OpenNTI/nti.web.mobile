import React from 'react';
import t from 'common/locale';

export default function Unknown () {
	return (
		<div className="unknown solution">
			<h4>{t('COMING_SOON.singular', {subject: 'This solution type'})}</h4>
		</div>
	);
}
