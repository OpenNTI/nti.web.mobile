import React from 'react';
import createReactClass from 'create-react-class';
import NoteableMixin from '../mixins/Noteable';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import {DateTime} from 'nti-web-commons';

export default createReactClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'assessment.userscourseassignmenthistoryitemfeedback'
	},


	propTypes: {
		item: React.PropTypes.object
	},


	render () {
		const {props: {item}, state: {url}} = this;
		const assignmentName = item.AssignmentName || 'an assignment';

		return (
			<li className="notification-item">
				<a href={url}>
					<Avatar entity={this.state.username} width="32" height="32"/>
					<div className="wrap">
						<DisplayName entity={this.state.username}/>
							{' posted feedback on ' + assignmentName}
						<DateTime date={this.getEventTime()} relative/>
					</div>
				</a>
			</li>
		);
	}
});
