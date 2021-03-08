import React from 'react';

import { scoped } from '@nti/lib-locale';

const t = scoped('enrollment.gift.header', {
	title: 'Gift Information',
	description:
		'If you would like for us to send a gift notification to the person for whom you are purchasing this course, please enter their name and email below. Pricing information is not included in this notification.',
});

export default function GiftViewHeader() {
	return (
		<div className="gift-header">
			<h2>{t('title')}</h2>
			<p>{t('description')}</p>
		</div>
	);
}
