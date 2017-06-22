import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import cx from 'classnames';
import {DateTime, EmptyList} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

const t = scoped('ASSESSMENT.ASSIGNMENTS.GROUP_LABELS');

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default createReactClass({
	displayName: 'AssignmentGroup',
	mixins: [AssignmentsAccessor],

	propTypes: {
		group: PropTypes.object.isRequired
	},

	contextTypes: {
		isInstructor: PropTypes.bool,
		AssignmentListItem: PropTypes.func.isRequired
	},


	render () {
		const {context: {isInstructor: instructor, AssignmentListItem: Item}, props: {group}} = this;
		const classes = cx( 'assignment-group', {instructor});

		return (
			<div className={classes}>
				<h2>
					<span>{
						isDate(group.label)
							? ( <DateTime date={group.label}/> )
							: t(group.label || 'unset', {fallback: group.label})}</span>
					{instructor && <span className="column-heading">Completion</span>}
				</h2>
				<ul>
					{
						group.items.length > 0
							? group.items.map(assignment => (
								<li key={assignment.getID()}>
									<Item assignment={assignment} />
								</li>
							))
							: <EmptyList type="assignments"/>

					}
				</ul>
			</div>
		);
	}
});


function isDate (d) {
	return !!(d || {}).toDateString;
}
