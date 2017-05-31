import React from 'react';
import createReactClass from 'create-react-class';
import NoteableMixin from '../mixins/Noteable';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import {DateTime} from 'nti-web-commons';

import ProfileLink from 'profile/components/ProfileLink';

export default createReactClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'user'
	},


	render () {
		let {change, username} = this.state;
		let time = this.getEventTime(change);

		return (
			<li className="notification-item">
				<ProfileLink entity={username}>
					<Avatar entity={username} width="32" height="32"/>
					<div className="wrap">
						<DisplayName entity={username}/>
							{' added you as a contact.'}
						<DateTime date={time} relative/>
					</div>
				</ProfileLink>
			</li>
		);
	}
});
