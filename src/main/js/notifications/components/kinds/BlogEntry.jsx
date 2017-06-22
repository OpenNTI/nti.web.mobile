import React from 'react';
import createReactClass from 'create-react-class';
import {DateTime} from 'nti-web-commons';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import NoteableMixin from '../mixins/Noteable';

export default createReactClass({
	displayName: 'BlogEntryType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'forums.personalblogentry'
	},

	render () {
		let blogName = this.state.item.title;
		return (
			<li className="notification-item">
				<Avatar entity={this.state.username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName entity={this.state.username}/>
						{' created a thought: ' + blogName}
					<DateTime date={this.getEventTime()} relative/>
				</div>
			</li>
		);
	}
});
