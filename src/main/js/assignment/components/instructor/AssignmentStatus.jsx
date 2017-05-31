import React from 'react';
import createReactClass from 'create-react-class';
import cx from 'classnames';

import {DateTime, Mixins} from 'nti-web-commons';


export default createReactClass({
	displayName: 'AssignmentStatus',

	mixins: [Mixins.ItemChanges],

	propTypes: {
		assignment: React.PropTypes.object.isRequired,
		history: React.PropTypes.object
	},

	getItem () {
		const {history = {}} = this.props;
		return history.grade;
	},

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
});
