import './AssignmentGroup.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { DateTime, EmptyList } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const t = scoped('assessment.assignment.group_labels', {
	Unknown: 'Other Assignments',
	'no-due-date': 'Other',
	unset: '',
});

const isDate = d => !!(d || {}).toDateString;

export default class AssignmentGroup extends React.Component {
	static propTypes = {
		group: PropTypes.object.isRequired,
	};

	static contextTypes = {
		isInstructor: PropTypes.bool,
		AssignmentListItem: PropTypes.func.isRequired,
	};

	render() {
		const {
			context: { isInstructor: instructor, AssignmentListItem: Item },
			props: { group },
		} = this;

		const classes = cx('assignment-group', { instructor });

		if (!Item) {
			return <div>Missing Row Spec</div>;
		}

		return (
			<div className={classes}>
				<h2>
					<span>
						{isDate(group.label) ? (
							<DateTime date={group.label} />
						) : (
							t(group.label || 'unset', { fallback: group.label })
						)}
					</span>
					{instructor && (
						<span className="column-heading">Completion</span>
					)}
				</h2>
				<ul>
					{group.items.length > 0 ? (
						group.items.map(assignment => (
							<li key={assignment.getID()}>
								<Item assignment={assignment} />
							</li>
						))
					) : (
						<EmptyList type="assignments" />
					)}
				</ul>
			</div>
		);
	}
}
