import React from 'react';
import cx from 'classnames';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import {HISTORY_LINK} from 'nti.lib.interfaces/models/assessment/Constants';

import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';

export default React.createClass({
	displayName: 'AssignmentItem',

	propTypes: {
		assignment: React.PropTypes.object.isRequired
	},

	render () {
		let {assignment} = this.props;
		let classes = cx('assignment-item', {
			complete: assignment.hasLink(HISTORY_LINK)
		});
		return (
			<a className={classes} href={`./${encodeForURI(assignment.getID())}/`}>
				{assignment.title}
				<AssignmentStatusLabel assignment={assignment} showTimeWithDate/>
			</a>
		);
	}
});
