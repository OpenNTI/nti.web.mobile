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

	propTypes: {
		item: React.PropTypes.object
	},

	componentWillMount () {
		// console.debug('Group Chat:', this.props.item);
	},

	render () {
		return (
			<li className="notification-item"/>
		);
	}
});
