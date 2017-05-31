import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import {Panel as ModeledContent} from 'modeled-content';

import Avatar from 'common/components/Avatar';
import Breadcrumb from 'common/components/BreadcrumbPath';
import {DateTime, LuckyCharms} from 'nti-web-commons';
import DisplayName from 'common/components/DisplayName';

import Mixin from './Mixin';

export default createReactClass({
	displayName: 'ForumComment',
	mixins: [Mixin],

	statics: {
		mimeType: /forums\.(.+)forumcomment/i
	},

	propTypes: {
		item: PropTypes.any.isRequired
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
							<DateTime date={item.getCreatedTime()} relative/>
						</div>
					</div>
					<ModeledContent body={item.body} />
				</div>
			</div>
		);
	}
});
