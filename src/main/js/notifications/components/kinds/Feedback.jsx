import React from 'react';
import NoteableMixin from '../mixins/Noteable';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'assessment.userscourseassignmenthistoryitemfeedback'
	},


	propTypes: {
		item: React.PropTypes.object
	},


	render () {
		let item = this.props.item;
		let assignmentName = item.AssignmentName || 'an assignment';
		return (
			<li className="notification-item">
				<Avatar entity={this.state.username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName entity={this.state.username}/>
						{' posted feedback on ' + assignmentName}
					<DateTime date={this.getEventTime()} relative/>
				</div>
			</li>
		);
	}
});
