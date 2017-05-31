import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import {DateTime, Loading, LuckyCharms} from 'nti-web-commons';

import {Panel as ModeledContentPanel} from 'modeled-content';

export default function TopicHeadline ({className, item}) {
	if (!item) {
		return <Loading.Whacky />;
	}

	const post = item.headline || item;

	return (
		<div className={cx('headline post', className)}>
			<LuckyCharms item={item} />
			<Avatar entity={post.creator}/>
			<div className="wrap">
				<h1>{post.title}</h1>
				<div className="meta">
					<DisplayName entity={post.creator}/>{' · '}<DateTime date={post.getCreatedTime()} relative/>
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
		title: PropTypes.string,
		getCreatedTime: PropTypes.func
	}),

	topic: PropTypes.object
};
