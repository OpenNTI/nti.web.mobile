import React from 'react/addons';
import NoteableMixin from '../mixins/Noteable';

// import Avatar from 'common/components/Avatar';
// import DisplayName from 'common/components/DisplayName';
// import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'Chat',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'messageinfo'
	},


	render () {
		return (
			<li className="notification-item">
			</li>
		);
	}
});
