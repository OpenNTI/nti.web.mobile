import React from 'react';
import ModeledContent from 'modeled-content/components/Panel';

export default React.createClass({
	displayName: 'CommunityHeadlineTopic',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.forums\.communityheadlinetopic/i,
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
			<ModeledContent body={item.headline.body} />
		);

	}
});
