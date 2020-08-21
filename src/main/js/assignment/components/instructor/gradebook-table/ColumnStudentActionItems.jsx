import './ColumnStudentActionItems.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {rawContent} from '@nti/lib-commons';

import StudentLink from './StudentLink';

const t = scoped('nti-web-mobile.assignment.components.instructor.gradebook-table.ColumnStudentActionItems', {
	overdue: {
		one: '%(count)s Assignment Overdue',
		other: '%(count)s Assignments Overdue'
	},
	ungraded: {
		one: '%(count)s Assignment Ungraded',
		other: '%(count)s Assignments Ungraded'
	}
});

export default class ColumnStudentActionItems extends React.Component {

	static propTypes = {
		item: PropTypes.shape({
			user: PropTypes.any,
			overdue: PropTypes.number,
			ungraded: PropTypes.number
		}).isRequired
	}

	static label = () => 'Student'
	static className = 'col-student'
	static sort = 'LastName'

	render () {
		const {item} = this.props;

		let actions = [];
		if(item.overdue > 0) {
			actions.push(t('overdue', {count: item.overdue}));
		}

		if(item.ungraded > 0) {
			actions.push(t('ungraded', {count: item.ungraded}));
		}

		if (actions.length === 0) {
			actions.push('No action items');
		}

		const classes = cx( 'actionable', {
			'ungraded': item.ungraded > 0,
			'overdue': item.overdue > 0
		});

		const content = actions.join(',<br/> ');

		return (
			<StudentLink item={item}>
				<div className={classes} {...rawContent(content)} />
			</StudentLink>
		);
	}
}
