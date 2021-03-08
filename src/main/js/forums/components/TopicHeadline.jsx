import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { DateTime, Loading, LuckyCharms } from '@nti/web-commons';
import Avatar from 'internal/common/components/Avatar';
import DisplayName from 'internal/common/components/DisplayName';
import { Panel as ModeledContentPanel } from 'internal/modeled-content';

export default function TopicHeadline({ className, item }) {
	if (!item) {
		return <Loading.Whacky />;
	}

	const post = item.headline || item;

	return (
		<div className={cx('headline post', className)}>
			<LuckyCharms item={item} />
			<Avatar entity={post.creator} />
			<div className="wrap">
				<h1>{post.title}</h1>
				<div className="meta">
					<DisplayName entity={post.creator} />
					{' · '}
					<DateTime date={post.getCreatedTime()} relative />
				</div>
			</div>
			<ModeledContentPanel body={post.body} />
		</div>
	);
}

TopicHeadline.propTypes = {
	className: PropTypes.string,

	item: PropTypes.shape({
		creator: PropTypes.string,
		body: PropTypes.array,
		headline: PropTypes.object,
		title: PropTypes.string,
		getCreatedTime: PropTypes.func,
	}),

	topic: PropTypes.object,
};
