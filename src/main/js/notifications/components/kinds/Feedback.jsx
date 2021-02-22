import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { DateTime } from '@nti/web-commons';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import NoteableMixin from '../mixins/Noteable';

export default createReactClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'assessment.userscourseassignmenthistoryitemfeedback',
	},

	propTypes: {
		item: PropTypes.object,
	},

	render() {
		const {
			props: { item },
			state: { url },
		} = this;
		const assignmentName = item.AssignmentName || 'an assignment';

		return (
			<li className="notification-item">
				<a href={url}>
					<Avatar
						entity={this.state.username}
						width="32"
						height="32"
					/>
					<div className="wrap">
						<DisplayName entity={this.state.username} />
						{' posted feedback on ' + assignmentName}
						<DateTime date={this.getEventTime()} relative />
					</div>
				</a>
			</li>
		);
	},
});
