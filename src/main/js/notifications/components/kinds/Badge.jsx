import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';

import { DateTime } from '@nti/web-commons';

import NoteableMixin from '../mixins/Noteable';

export default createReactClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'openbadges.badge',
	},

	propTypes: {
		item: PropTypes.object,
	},

	render() {
		let item = (this.props.item || {}).Item;
		return (
			<li className="notification-item">
				<div
					className="badge"
					style={{ backgroundImage: `url(${item.image})` }}
				/>
				<div className="wrap">
					<b>{item.name}</b> badge earned.
					<DateTime date={this.getEventTime()} relative />
				</div>
			</li>
		);
	},
});
