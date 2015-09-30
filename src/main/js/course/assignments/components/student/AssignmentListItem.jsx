import React from 'react';
import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';
import cx from 'classnames';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

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
			<a className={classes} href={`./${encodeForURI(assignment.getID())}/`}>
				{assignment.title}
				<AssignmentStatusLabel assignment={assignment} />
			</a>
		);
	}
});
