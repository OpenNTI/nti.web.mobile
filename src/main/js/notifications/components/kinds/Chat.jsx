import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import NoteableMixin from '../mixins/Noteable';

// import Avatar from 'common/components/Avatar';
// import DisplayName from 'common/components/DisplayName';
// import {DateTime} from 'nti-web-commons';

export default createReactClass({
	displayName: 'Chat',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'messageinfo'
	},

	propTypes: {
		item: PropTypes.object
	},

	componentWillMount () {
		// console.debug('One on One Chat:', this.props.item);
	},

	render () {
		return (
			<li className="notification-item"/>
		);
	}
});
