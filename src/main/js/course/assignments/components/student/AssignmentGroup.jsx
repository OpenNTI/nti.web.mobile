import React from 'react';
import AssignmentItem from './AssignmentItem';

export default React.createClass({
	displayName: 'AssignmentGroup',

	propTypes: {
		group: React.PropTypes.object.isRequired
	},

	render () {

		let {group} = this.props;

		return (
			<div className="assignment-group">
				<div>(heading)</div>
				{group.items.map(assignment => <AssignmentItem assignment={assignment} />)}
			</div>
		);
	}
});
