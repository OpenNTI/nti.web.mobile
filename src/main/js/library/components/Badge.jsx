import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {DateTime} from 'nti-web-commons';

import Filters, {ARCHIVED, UPCOMING} from '../Filters';

Badge.propTypes = {
	item: PropTypes.object.isRequired
};

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
			label = (
				<span>
					<DateTime date={item.getStartDate()} className="long"/>
					<DateTime date={item.getStartDate()} className="short" format="ll"/>
				</span>
			);
		}
		else if (type.kind === ARCHIVED) {
			[{label}] = type.split([item]);
		}
	}

	return !label ? <div/> : (
		<div className={cx('nti-library-item-badge', flags)}>
			{label}
		</div>
	);

}
