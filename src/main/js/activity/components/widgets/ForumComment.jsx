import './ForumComment.scss';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { DateTime, LuckyCharms } from '@nti/web-commons';
import { Panel as ModeledContent } from 'internal/modeled-content';
import Avatar from 'internal/common/components/Avatar';
import Breadcrumb from 'internal/common/components/BreadcrumbPath';
import DisplayName from 'internal/common/components/DisplayName';

import Mixin from './Mixin';

export default createReactClass({
	displayName: 'ForumComment',
	mixins: [Mixin],

	statics: {
		mimeType: /forums\.(.+)forumcomment/i,
	},

	propTypes: {
		item: PropTypes.any.isRequired,
	},

	render() {
		let { item } = this.props;
		if (!item) {
			return null;
		}

		return (
			<div className="forum-comment">
				<Breadcrumb item={item} />
				<div className="body">
					<LuckyCharms item={item} />
					<div className="wrap">
						<Avatar entity={item.creator} />{' '}
						<DisplayName entity={item.creator} /> commented on this
						discussion.
						<div className="meta">
							<DateTime date={item.getCreatedTime()} relative />
						</div>
					</div>
					<ModeledContent body={item.body} />
				</div>
			</div>
		);
	},
});
