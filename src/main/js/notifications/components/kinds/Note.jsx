import React from 'react';

import Logger from 'nti-util-logger';

import NoteableMixin from '../mixins/Noteable';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import {DateTime} from 'nti-web-commons';

const logger = Logger.get('notifications:kinds:Note');

function trunc (txt, len) {
	if (txt.length <= len) {
		return txt;
	}

	return txt.substr(0, Math.max(0, len - 3)) + '...';
}

export default React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'note'
	},


	componentDidMount  () {
		this.updatePreview(this.props);
	},


	componentWillReceiveProps (props) {
		this.updatePreview(props);
	},


	updatePreview  (props) {
		let change = props.item;
		let note = change.Item || change;
		let title = note.title;
		let body = note.body || [];
		let node;

		if (title) {
			this.setState({preview: title, note});
			return;
		}

		try {
			node = document.createElement('div');
			body = body.map(p => typeof p === 'object' ? '[attachment]' : p).join(' ');

			node.innerHTML = body;

			const preview = trunc(node.textContent, 140);

			this.setState({preview, note});
		} catch (e) {
			logger.error(e.stack);
		}
	},


	render () {
		let {url, username, preview, note} = this.state;
		return (
			<li className="notification-item">
				<a href={url}>
					<Avatar entity={username} width="32" height="32"/>
					<div className="wrap">
						<DisplayName entity={username}/>
							{ note && note.isReply() ? ' commented on a note' : ' shared a note: ' + preview}
						<DateTime date={this.getEventTime()} relative/>
					</div>
				</a>
			</li>

		);
	}
});
