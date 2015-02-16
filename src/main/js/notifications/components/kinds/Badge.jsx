import React from 'react';
import NoteableMixin from '../mixins/Noteable';
import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'openbadges.badge'
	},

	render () {
		var item = (this.props.item || {}).Item;
		return (
			<li className="notification-item">
				<div className='badge' style={{backgroundImage: `url(${item.image})`}}/>
				<div className="wrap">
					{item.name}
					<DateTime date={this.getEventTime()} />
				</div>
			</li>
		);
	}
});
