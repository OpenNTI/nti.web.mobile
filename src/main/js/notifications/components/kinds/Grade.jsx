import React from 'react';
import NoteableMixin from '../mixins/Noteable';
import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'grade'
	},

	render () {
		var item = this.props.item.Item;
		var courseName = item.CourseName;
		var assignmentName = item.AssignmentName || 'an assignment';
		return (
			<li className="notification-item">
				<div className='grade'/>
				<div className="wrap">
					Grade recieved for {assignmentName} in {courseName}
					<DateTime date={this.getEventTime()} />
				</div>
			</li>
		);
	}
});
