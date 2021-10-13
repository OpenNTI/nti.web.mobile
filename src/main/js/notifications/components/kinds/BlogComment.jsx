import createReactClass from 'create-react-class';

import { DateTime } from '@nti/web-commons';
import Avatar from 'internal/common/components/Avatar';
import DisplayName from 'internal/common/components/DisplayName';

import NoteableMixin from '../mixins/Noteable';

export default createReactClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],
	statics: {
		noteableType: 'forums.personalblogcomment',
	},

	render() {
		let thestring = ' commented on a thought.';
		return (
			<li className="notification-item">
				<Avatar entity={this.state.username} width="32" height="32" />
				<div className="wrap">
					<DisplayName entity={this.state.username} />
					{thestring}
					<DateTime date={this.getEventTime()} relative />
				</div>
			</li>
		);
	},
});
