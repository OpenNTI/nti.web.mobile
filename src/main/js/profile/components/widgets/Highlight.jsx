import React from 'react';

export default React.createClass({
	displayName: 'Highlight',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.highlight/i,
		handles (item) {
			return item.MimeType && this.mimeTest.test(item.MimeType);
		}
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	render () {

		let {item} = this.props;
		if (!item) {
			return null;
		}

		return (
			<div>{item.selectedText}</div>
		);

	}
});
