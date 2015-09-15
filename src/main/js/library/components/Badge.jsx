import React from 'react';
import cx from 'classnames';

import DateTime from 'common/components/DateTime';

import Filters, {ARCHIVED, UPCOMING} from '../Filters';

export default React.createClass({
	displayName: 'Badge',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		const {props: {item}} = this;
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

		return !label ? null : (
			<div className={cx('badge', flags)}>
				{label}
			</div>
		);
	}
});
