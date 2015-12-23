import React from 'react';
import cx from 'classnames';

import DateTime from 'common/components/DateTime';
import EmptyList from 'common/components/EmptyList';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'AssignmentGroup',
	mixins: [AssignmentsAccessor],

	propTypes: {
		group: React.PropTypes.object.isRequired
	},

	contextTypes: {
		AssignmentListItem: React.PropTypes.func.isRequired
	},


	render () {
		const admin = this.getCourse().isAdministrative;
		const {context: {AssignmentListItem: Item}, props: {group}} = this;
		const classes = cx( 'assignment-group', {admin});

		return (
			<div className={classes}>
				<h2>
					<span>{isDate(group.label) ? <DateTime date={group.label}/> : group.label}</span>
					{admin && <span className="column-heading">Completion</span>}
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
