import React from 'react';

import {scoped} from 'common/locale';

let t = scoped('ENROLLMENT.GIFT.HEADER');

export default React.createClass({
	displayName: 'GiftView:Header',

	render () {
		return (
			<div className="gift-header">
				<h2>{t('title')}</h2>
				<p>{t('description')}</p>
			</div>
		);
	}
});
