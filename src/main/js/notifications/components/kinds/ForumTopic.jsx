//TODO
import createReactClass from 'create-react-class';

import { DateTime } from '@nti/web-commons';
import Avatar from 'internal/common/components/Avatar';
import DisplayName from 'internal/common/components/DisplayName';

import NoteableMixin from '../mixins/Noteable';

export default createReactClass({
	displayName: 'ForumTopic',
	mixins: [NoteableMixin],

	statics: {
		// /forums\.((.*)headlinetopic)$/i
		noteableType: [
			'forums.headlinetopic',
			'forums.communityheadlinetopic',
			'forums.contentheadlinetopic',
			'forums.dflheadlinetopic',
		],
	},

	render() {
		let { item, username, url } = this.state;
		let date = this.getEventTime(item.headline);

		return (
			<li className="notification-item">
				<a href={url}>
					<Avatar entity={username} width="32" height="32" />
					<div className="wrap">
						<DisplayName entity={username} />
						{` created a discussion: ${item.title}`}
						<DateTime date={date} relative />
					</div>
				</a>
			</li>
		);
	},
});
