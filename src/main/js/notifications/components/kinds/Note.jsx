import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Logger from '@nti/util-logger';
import { DateTime } from '@nti/web-commons';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import NoteableMixin from '../mixins/Noteable';

const logger = Logger.get('notifications:kinds:Note');

function trunc(txt, len) {
	if (txt.length <= len) {
		return txt;
	}

	return txt.substr(0, Math.max(0, len - 3)) + '...';
}

export default createReactClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	propTypes: {
		item: PropTypes.object,
	},

	statics: {
		noteableType: 'note',
	},

	componentDidMount() {
		this.updatePreview(this.props);
	},

	componentDidUpdate(prevProps) {
		if (this.props.item !== prevProps.item) {
			this.updatePreview(this.props);
		}
	},

	updatePreview(props) {
		let change = props.item;
		let note = change.Item || change;
		let title = note.title;
		let body = note.body || [];
		let node;

		if (title) {
			this.setState({ preview: title, note });
			return;
		}

		try {
			node = document.createElement('div');
			body = body
				.map(p => (typeof p === 'object' ? '[attachment]' : p))
				.join(' ');

			node.innerHTML = body;

			const preview = trunc(node.textContent, 140);

			this.setState({ preview, note });
		} catch (e) {
			logger.error(e.stack);
		}
	},

	render() {
		let { url, username, preview, note } = this.state;
		return (
			<li className="notification-item">
				<a href={url}>
					<Avatar entity={username} width="32" height="32" />
					<div className="wrap">
						<DisplayName entity={username} />
						{note && note.isReply()
							? ' commented on a note'
							: ' shared a note: ' + preview}
						<DateTime date={this.getEventTime()} relative />
					</div>
				</a>
			</li>
		);
	},
});
