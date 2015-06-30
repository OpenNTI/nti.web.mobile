import React from 'react';
import ModeledContent from 'modeled-content/components/Panel';
import Breadcrumb from './Breadcrumb';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'ForumTopic',
	mixins: [Mixin],

	statics: {
		mimeType: /forums\.(.+)forumcomment/i
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
			<div className="forum-comment">
				<Breadcrumb item={item} />
				<ModeledContent body={item.body} />
			</div>
		);
	}
});
