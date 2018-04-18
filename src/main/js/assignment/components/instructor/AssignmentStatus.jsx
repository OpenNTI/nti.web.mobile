import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {DateTime, HOC} from '@nti/web-commons';


export default
@HOC.ItemChanges.compose
class AssignmentStatus extends React.Component {

	static propTypes = {
		assignment: PropTypes.object.isRequired,
		history: PropTypes.object
	}

	static getItem ({history}) {
		return (history || {}).grade;
	}

	render () {

		const {assignment, history} = this.props;

		if(!assignment) {
			return null;
		}

		const due = assignment.getDueDate();
		const submitted = history && history.getCreatedTime();
		const synthetic = history && history.isSyntheticSubmission();
		const isExcused = history && history.isGradeExcused();
		const isLate = due && submitted > due;

		let status;

		if(!history) {
			status = <span>Due <DateTime date={due} /></span>;
		}
		else if(isLate && !synthetic) {
			status = <span><DateTime date={due} relativeTo={submitted} suffix={false}/> late</span>;
		}
		else {
			status = <span>{synthetic ? 'Graded' : 'Submitted'} <DateTime date={submitted} /></span>;
		}

		const classes = cx('assignment-status', {
			'late': isLate,
			'excused': isExcused
		});

		return (
			<div className={classes}>
				<div>{status}</div>
				{isExcused && <div className="is-excused">Excused</div>}
			</div>
		);
	}
}
