//TODO
import React from 'react';
import NoteableMixin from '../mixins/Noteable';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'ForumTopic',
	mixins: [NoteableMixin],

	statics: {
		// /forums\.((.*)headlinetopic)$/i
		noteableType: [
			'forums.headlinetopic',
			'forums.communityheadlinetopic',
			'forums.contentheadlinetopic',
			'forums.dflheadlinetopic'
		]
	},

	render () {
		let {item, username, url} = this.state;
		let date = this.getEventTime(item.headline);

		return (
			<li className="notification-item">
				<a href={url}>
					<Avatar entity={username} width="32" height="32"/>
					<div className="wrap">
						<DisplayName entity={username}/>
							{` created a discussion: ${item.title}`}
						<DateTime date={date} relative/>
					</div>
				</a>
			</li>
		);
	}
});
