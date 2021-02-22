// import React from 'react';
import createReactClass from 'create-react-class';

import NoteableMixin from '../mixins/Noteable';

export default createReactClass({
	displayName: 'UnknownNotificationType',
	mixins: [NoteableMixin],

	render() {
		return null;
	},
});
