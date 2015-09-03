import React from 'react';
import AssignmentItem from './AssignmentItem';
import DateTime from 'common/components/DateTime';


export default React.createClass({
	displayName: 'AssignmentGroup',

	propTypes: {
		group: React.PropTypes.object.isRequired
	},

	render () {

		let {group} = this.props;

		return (
			<div className="assignment-group">
				<h2>{isDate(group.label) ? <DateTime date={group.label}/> : group.label}</h2>
				<ul>
					{group.items.map(assignment => <li key={assignment.getID()}><AssignmentItem assignment={assignment} /></li>)}
				</ul>
			</div>
		);
	}
});


function isDate(d) {
	return !!(d || {}).toDateString;
}
