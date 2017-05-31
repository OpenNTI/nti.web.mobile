import React from 'react';
import createReactClass from 'create-react-class';
import NoteableMixin from '../mixins/Noteable';
import {DateTime} from 'nti-web-commons';

export default createReactClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'openbadges.badge'
	},

	propTypes: {
		item: React.PropTypes.object
	},

	render () {
		let item = (this.props.item || {}).Item;
		return (
			<li className="notification-item">
				<div className="badge" style={{backgroundImage: `url(${item.image})`}}/>
				<div className="wrap">
					<b>{item.name}</b> badge earned.
					<DateTime date={this.getEventTime()} relative/>
				</div>
			</li>
		);
	}
});
