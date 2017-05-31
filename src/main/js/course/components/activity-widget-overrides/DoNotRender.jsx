import React from 'react';

export default class extends React.Component {
	static displayName = 'course:activity:DoNotRender';

	static handles (item) {
		return [
			/forums(.*)comment/i
		].some(x => x.test(item.MimeType));
	}

	render () {
		return null;
	}
}
