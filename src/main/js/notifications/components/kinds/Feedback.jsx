import React from 'react/addons';
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

	render () {
		var item = this.props.item;
		var assignmentName = item.AssignmentName || 'an assignment';
		return (
			<li className="notification-item">
				<Avatar username={this.state.username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName username={this.state.username}/>
						{' posted feedback on ' + assignmentName}
					<DateTime date={this.getEventTime()} />
				</div>
			</li>
		);
	}
});
