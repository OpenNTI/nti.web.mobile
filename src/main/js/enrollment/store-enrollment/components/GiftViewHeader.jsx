import React from 'react';

import {scoped} from 'common/locale';

let t = scoped('ENROLLMENT.GIFT.HEADER');

export default function GiftViewHeader () {
	return (
		<div className="gift-header">
			<h2>{t('title')}</h2>
			<p>{t('description')}</p>
		</div>
	);
}
