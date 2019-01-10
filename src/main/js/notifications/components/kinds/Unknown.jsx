import React from 'react';
import createReactClass from 'create-react-class';

import NoteableMixin from '../mixins/Noteable';

export default createReactClass({
	displayName: 'UnknownNotificationType',
	mixins: [NoteableMixin],

	render () {
		const {item} = this.state;
		//console.debug('Unhandled Notification Kind: %o', this.state.change);
		//console.debug(this.state.item);

		if(item.MimeType === 'application/vnd.nextthought.change' && !item.Item) {
			// this is a special case of Unknown, where we have a 'change' item but no sub-item in it to know how it should behave
			return (
				<li className="notification-item"/>
			);
		}


		let type = item.MimeType.replace('application/vnd.nextthought.', '');
		return (
			<li className="notification-item">Unknown {type}</li>
		);
	}
});
