import React from 'react';

import {scoped} from 'common/locale';

let tGift = scoped('ENROLLMENT.GIFT');

export default React.createClass({
	displayName: 'GiftView:Header',

	render () {
		return (
			<div>
				<h2>{tGift('HEADER.title')}</h2>
				<p>{tGift('HEADER.description')}</p>
			</div>
		);
	}
});
