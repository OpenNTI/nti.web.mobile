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
		noteableType: [
			'forums.generalforumcomment'
		]
	},

	render () {
		let {username, url} = this.state;
		let thestring = ' commented on a discussion.';

		return (
			<li className="notification-item">
				<a href={url}>
					<Avatar entity={username} width="32" height="32"/>
					<div className="wrap">
						<DisplayName entity={username}/>
							{thestring}
						<DateTime date={this.getEventTime()} relative/>
					</div>
				</a>
			</li>
		);
	}
});
