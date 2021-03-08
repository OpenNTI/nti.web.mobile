import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { scoped } from '@nti/lib-locale';
import { Event } from '@nti/web-calendar';
import { Avatar, DisplayName, DateTime, Prompt } from '@nti/web-commons';

import NoteableMixin from '../mixins/Noteable';

const t = scoped('mobile.notifications.components.kinds.Event', {
	created: ' created an event %(name)s',
	updated: ' updated an event %(name)s',
});

export default createReactClass({
	propTypes: {
		item: PropTypes.object,
	},
	displayName: 'EventType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'courseware.coursecalendarevent',
	},

	isCreated() {
		const { item } = this.props;

		return item && item.ChangeType === 'Created';
	},

	showEvent(e) {
		e.preventDefault();
		const { item } = this.state;

		//TODO: once we get a library path for events use it to navigate
		Prompt.modal(
			<Event.View
				getAvailableCalendars={() => []}
				event={item}
				nonDialog
			/>
		);
	},

	render() {
		const { item, username } = this.state;
		const localeKey = this.isCreated() ? 'created' : 'updated';

		return (
			<li className="notification-item">
				<a href="#" onClick={this.showEvent}>
					<Avatar entity={username} width={32} height={32} />
					<div className="wrap">
						<DisplayName entity={username} />
						<span>{t(localeKey, { name: item.title })}</span>
						<DateTime date={this.getEventTime()} relative />
					</div>
				</a>
			</li>
		);
	},
});
