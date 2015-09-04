import React from 'react';
import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';
import cx from 'classnames';

export default React.createClass({
	displayName: 'AssignmentItem',

	propTypes: {
		assignment: React.PropTypes.object.isRequired
	},

	render () {
		let {assignment} = this.props;
		let classes = cx('assignment-item', {
			complete: assignment.hasLink('History')
		});
		return (
			<div className={classes}>
				{assignment.title}
				<AssignmentStatusLabel assignment={assignment} />
			</div>
		);
	}
});
