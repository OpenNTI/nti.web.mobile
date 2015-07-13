
import React from 'react';
import NoteableMixin from '../mixins/Noteable';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'user'
	},


	render () {
		let {change, username} = this.state;
		let time = change && change.getLastModified();

		return (
			<li className="notification-item">
				<Avatar entity={username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName entity={username}/>
						{" added you as a contact."}
					<DateTime date={time} relative/>
				</div>
			</li>
		);
	}
});
