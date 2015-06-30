import React from 'react';

import ModeledContent from 'modeled-content/components/Panel';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'ForumTopic',
	mixins: [Mixin],

	statics: {
		mimeType: /^forums\.(.+)forumcomment/i
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
			<ModeledContent body={item.body} />
		);

	}
});
