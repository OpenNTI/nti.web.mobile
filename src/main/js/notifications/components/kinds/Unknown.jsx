import React from 'react';
import NoteableMixin from '../mixins/Noteable';

export default React.createClass({
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
