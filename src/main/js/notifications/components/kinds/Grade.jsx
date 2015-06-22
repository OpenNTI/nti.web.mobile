import React from 'react';
import NoteableMixin from '../mixins/Noteable';
import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: [
			'gradebook.grade',
			'grade'
		]
	},


	propTypes: {
		item: React.PropTypes.object
	},


	render () {
		let item = this.props.item.Item;
		let courseName = item.CourseName ? ` in ${item.CourseName}` : '';
		let assignmentName = item.AssignmentName || 'an assignment';
		return (
			<li className="notification-item">
				<div className='grade'/>
				<div className="wrap">
					Grade received for {assignmentName}{courseName}
					<DateTime date={this.getEventTime()} relative />
				</div>
			</li>
		);
	}
});
