import React from 'react';
import NoteableMixin from '../mixins/Noteable';

// import Avatar from 'common/components/Avatar';
// import DisplayName from 'common/components/DisplayName';
// import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'ChatGroup',
	mixins: [NoteableMixin],

	statics: {
		noteableType: '_meeting'
	},

	componentWillMount () {
		console.debug('Group Chat:', this.state.item);
	},

	render () {
		// return (
		// 	<li className="notification-item">
		// 	</li>
		// );
	}
});
