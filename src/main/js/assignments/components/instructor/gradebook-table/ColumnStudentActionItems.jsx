import React from 'react';
import cx from 'classnames';

import {scoped} from 'common/locale';

import StudentLink from './StudentLink';
import StudentStatics from './StudentStaticsMixin';

const t = scoped('UNITS');

export default React.createClass({
	displayName: 'ColumnStudentActionItems',

	mixins: [StudentStatics],

	propTypes: {
		item: React.PropTypes.shape({
			user: React.PropTypes.any,
			overdue: React.PropTypes.number,
			ungraded: React.PropTypes.number
		}).isRequired
	},

	render () {
		const {item} = this.props;

		let actions = [];
		if(item.overdue > 0) {
			const assignments = t('assignments', {count: item.overdue});
			actions.push(`${assignments} overdue`);
		}

		if(item.ungraded > 0) {
			const assignments = t('assignments', {count: item.overdue});
			actions.push(`${assignments} ungraded`);
		}

		if (actions.length === 0) {
			actions.push('No action items');
		}

		const classes = cx( 'actionable', {
			'ungraded': item.ungraded > 0,
			'overdue': item.overdue > 0
		});

		return (
			<StudentLink item={item}>
				<div className={classes}>{actions.join(', ')}</div>
			</StudentLink>
		);
	}
});
