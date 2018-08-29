import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
// import {DateTime} from '@nti/web-commons';

// import Avatar from 'common/components/Avatar';
// import DisplayName from 'common/components/DisplayName';

import NoteableMixin from '../mixins/Noteable';

export default createReactClass({
	displayName: 'ChatGroup',
	mixins: [NoteableMixin],

	statics: {
		noteableType: '_meeting'
	},

	propTypes: {
		item: PropTypes.object
	},

	componentDidMount () {
		// console.debug('Group Chat:', this.props.item);
	},

	render () {
		return (
			<li className="notification-item"/>
		);
	}
});
