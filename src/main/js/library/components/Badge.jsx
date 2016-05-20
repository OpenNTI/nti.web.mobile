import React from 'react';
import cx from 'classnames';

import {DateTime} from 'nti-web-commons';

import Filters, {ARCHIVED, UPCOMING} from '../Filters';

export default function Badge ({item}) {

	let type, label;
	let flags = {};

	for (let filter of Filters) {
		if(filter.test(item)) {
			type = filter;
			flags[type.kind] = true;
			break;
		}
	}

	if (type) {
		if (type.kind === UPCOMING) {
			label = ( <DateTime date={item.getStartDate()}/> );
		}
		else if (type.kind === ARCHIVED) {
			[{label}] = type.split([item]);
		}
	}

	return !label ? <div/> : (
		<div className={cx('badge', flags)}>
			{label}
		</div>
	);

}

Badge.propTypes = {
	item: React.PropTypes.object.isRequired
};
