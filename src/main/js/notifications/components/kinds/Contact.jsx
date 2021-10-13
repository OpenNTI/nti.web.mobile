import createReactClass from 'create-react-class';

import { DateTime } from '@nti/web-commons';
import Avatar from 'internal/common/components/Avatar';
import DisplayName from 'internal/common/components/DisplayName';
import ProfileLink from 'internal/profile/components/ProfileLink';

import NoteableMixin from '../mixins/Noteable';

export default createReactClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'user',
	},

	render() {
		let { change, username } = this.state;
		let time = this.getEventTime(change);

		return (
			<li className="notification-item">
				<ProfileLink entity={username}>
					<Avatar entity={username} width="32" height="32" />
					<div className="wrap">
						<DisplayName entity={username} />
						{' added you as a contact.'}
						<DateTime date={time} relative />
					</div>
				</ProfileLink>
			</li>
		);
	},
});
