import React from 'react';
import createReactClass from 'create-react-class';

import NoteableMixin from '../mixins/Noteable';

export default createReactClass({
	displayName: 'UnknownNotificationType',
	mixins: [NoteableMixin],

	render () {
		//console.debug('Unhandled Notification Kind: %o', this.state.change);
		//console.debug(this.state.item);
		let type = this.state.item.MimeType.replace('application/vnd.nextthought.', '');
		return (
			<li className="notification-item">Unknown {type}</li>
		);
	}
});
