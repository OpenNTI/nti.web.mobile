import React from 'react';
import ModeledContent from 'modeled-content/components/Panel';
import Breadcrumb from './Breadcrumb';
import LuckyCharms from 'common/components/LuckyCharms';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'ForumComment',
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
				<div className="body">
					<LuckyCharms item={item} />
					<Avatar username={item.creator} /> <DisplayName username={item.creator} /> commented on this discussion.
					<ModeledContent body={item.body} />
				</div>
			</div>
		);
	}
});
