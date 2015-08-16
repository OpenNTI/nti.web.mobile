import React from 'react';
import {Panel as ModeledContent} from 'modeled-content';
import Breadcrumb from './Breadcrumb';
import LuckyCharms from 'common/components/LuckyCharms';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'ForumComment',
	mixins: [Mixin],

	statics: {
		mimeType: /forums\.(.+)comment/i
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
					<div className="wrap">
						<Avatar entity={item.creator} /> <DisplayName entity={item.creator} /> commented on this discussion.
						<div className="meta">
							<DateTime date={item.getCreatedTime()} relative={true}/>
						</div>
					</div>
					<ModeledContent body={item.body} />
				</div>
			</div>
		);
	}
});
