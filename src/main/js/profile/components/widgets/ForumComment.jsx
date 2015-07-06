import React from 'react';

export default React.createClass({
	displayName: 'ForumTopic',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.forums\.generalforumcomment/i,
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
			<div>{item.body}</div>
		);

	}
});
