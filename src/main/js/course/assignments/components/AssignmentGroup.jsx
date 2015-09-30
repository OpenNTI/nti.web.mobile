import React from 'react';
import AssignmentItem from './AssignmentItem';
import DateTime from 'common/components/DateTime';
import cx from 'classnames';
import EmptyList from 'common/components/EmptyList';

export default React.createClass({
	displayName: 'AssignmentGroup',

	propTypes: {
		course: React.PropTypes.object.isRequired,
		group: React.PropTypes.object.isRequired
	},

	render () {

		let {group, course} = this.props;
		let classes = cx( 'assignment-group', {
			'admin': course.isAdministrative
		});

		return (
			<div className={classes}>
				<h2>
					<span>{isDate(group.label) ? <DateTime date={group.label}/> : group.label}</span>
					{course.isAdministrative && <span className="column-heading">Completion</span>}
				</h2>
				<ul>
					{
						group.items.length > 0
							? group.items.map(assignment => <li key={assignment.getID()}><AssignmentItem assignment={assignment} course={course} /></li>)
							: <EmptyList type='assignments'/>

					}
				</ul>
			</div>
		);
	}
});


function isDate (d) {
	return !!(d || {}).toDateString;
}
