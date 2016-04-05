import React from 'react';
import cx from 'classnames';

import ItemChanges from 'common/mixins/ItemChanges';

import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'AssignmentStatus',

	mixins: [ItemChanges],

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

		const due = assignment.getAvailableForSubmissionEnding();
		const submitted = history && history.getCreatedTime();
		const isExcused = history && history.isGradeExcused();
		const isLate = due && submitted > due;

		let status;

		if(!history) {
			status = <span>Due <DateTime date={due} /></span>;
		}
		else if(isLate) {
			status = <span><DateTime date={due} relativeTo={submitted} suffix={false}/> late</span>;
		}
		else {
			status = <span>Submitted <DateTime date={submitted} /></span>;
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
