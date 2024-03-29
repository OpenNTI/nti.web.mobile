import './AssignmentStatus.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { decorate } from '@nti/lib-commons';
import { DateTime, HOC } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const t = scoped(
	'nti-web-mobile.assignment.components.instructor.AssignmentViewStudentHeader',
	{
		graded: 'Graded',
		submitted: 'Submitted',
	}
);

class AssignmentStatus extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired,
		history: PropTypes.object,
	};

	static getItem({ history }) {
		return (history || {}).grade;
	}

	render() {
		const { assignment, history: container } = this.props;

		if (!assignment) {
			return null;
		}

		const history = container?.getMostRecentHistoryItem?.() || container;

		const due = assignment.getDueDate();
		const submitted = history?.getCreatedTime();
		const synthetic = history?.isSyntheticSubmission();
		const isExcused = history?.isGradeExcused();
		const isLate = due && submitted > due;

		let status;

		if (!history) {
			status = (
				<span>
					Due <DateTime date={due} />
				</span>
			);
		} else if (isLate && !synthetic) {
			status = (
				<span>
					<DateTime
						date={due}
						relativeTo={submitted}
						suffix={false}
					/>{' '}
					late
				</span>
			);
		} else {
			status = (
				<span>
					{synthetic ? t('graded') : t('submitted')}{' '}
					<DateTime date={submitted} />
				</span>
			);
		}

		const classes = cx('assignment-status', {
			late: isLate,
			excused: isExcused,
		});

		return (
			<div className={classes}>
				<div>{status}</div>
				{isExcused && <div className="is-excused">Excused</div>}
			</div>
		);
	}
}

export default decorate(AssignmentStatus, [HOC.ItemChanges.compose]);
