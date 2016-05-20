import React from 'react';
import cx from 'classnames';

import Avatar from 'common/components/Avatar';
import {DateTime} from 'nti-web-commons';
import DisplayName from 'common/components/DisplayName';
import {LoadingInline as Loading} from 'nti-web-commons';
import LuckyCharms from 'common/components/LuckyCharms';

import {Panel as ModeledContentPanel} from 'modeled-content';

export default function TopicHeadline ({className, item}) {
	if (!item) {
		return <Loading />;
	}

	const post = item.headline || item;

	return (
		<div className={cx('headline post', className)}>
			<LuckyCharms item={item} />
			<Avatar entity={post.creator}/>
			<div className="wrap">
				<h1>{post.title}</h1>
				<div className="meta">
					<DisplayName entity={post.creator}/>{" · "}<DateTime date={post.getCreatedTime()} relative/>
				</div>
			</div>
			<ModeledContentPanel body={post.body} />
		</div>
	);
}

TopicHeadline.propTypes = {
	className: React.PropTypes.string,

	item: React.PropTypes.shape({
		creator: React.PropTypes.string,
		body: React.PropTypes.array,
		title: React.PropTypes.string,
		getCreatedTime: React.PropTypes.func
	}),

	topic: React.PropTypes.object
};
