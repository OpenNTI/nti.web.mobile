import React from 'react';
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

	propTypes: {
		item: React.PropTypes.object
	},

	componentWillMount () {
		console.debug('One on One Chat:', this.props.item);
	},

	render () {
		return (
			<li className="notification-item"/>
		);
	}
});
