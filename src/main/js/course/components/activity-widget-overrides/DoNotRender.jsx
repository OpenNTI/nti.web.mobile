import React from 'react';

export default React.createClass({
	displayName: 'course:activity:DoNotRender',

	statics: {
		handles (item) {
			return [
				/forums(.*)comment/i
			].some(x => x.test(item.MimeType));
		}
	},

	render () {
		return null;
	}
});
