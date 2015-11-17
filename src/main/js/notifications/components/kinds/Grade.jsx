import React from 'react';

import DateTime from 'common/components/DateTime';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import NoteableMixin from '../mixins/Noteable';

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
		const {item: {Item: {creator, CourseName, AssignmentName = 'an assignment'}}} = this.props;

		return (
			<li className="notification-item">
				<Avatar entity={creator} width="32" height="32"/>
				<div className="wrap">
					<DisplayName entity={creator} /> graded {AssignmentName}{CourseName ? ` in ${CourseName}` : ''}
					<DateTime date={this.getEventTime()} relative />
				</div>
			</li>
		);
	}
});
