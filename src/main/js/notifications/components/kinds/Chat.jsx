import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
// import {DateTime} from '@nti/web-commons';

// import Avatar from 'common/components/Avatar';
// import DisplayName from 'common/components/DisplayName';

import NoteableMixin from '../mixins/Noteable';


export default createReactClass({
	displayName: 'Chat',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'messageinfo'
	},

	propTypes: {
		item: PropTypes.object
	},

	componentDidMount () {
		// console.debug('One on One Chat:', this.props.item);
	},

	render () {
		return (
			<li className="notification-item"/>
		);
	}
});
