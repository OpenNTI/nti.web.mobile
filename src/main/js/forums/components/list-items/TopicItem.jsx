import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-component';
import createReactClass from 'create-react-class';

import { DateTime, LuckyCharms } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import { encodeForURI } from '@nti/lib-ntiids';
import { StoreEventsMixin } from '@nti/lib-store';
import DisplayName from 'internal/common/components/DisplayName';
import Avatar from 'internal/common/components/Avatar';

import KeepItemInState from '../../mixins/KeepItemInState';
import { mimeTypes, TOPIC, POST } from '../../Constants';
import Store from '../../Store';

import Mixin, { isMimeType } from './Mixin';

const DEFAULT_TEXT = {
	posted: 'posted',
	replied: 'replied',
	likes: {
		zero: '0 Likes',
		one: '1 Like',
		other: '%(count)s Likes',
	},
	replies: {
		one: '1 Comment',
		other: '%(count)s Comments',
	},
};

const t = scoped('forums.topic', DEFAULT_TEXT);

/**
 * For lists of Topics, this is the row item.
 */
export default createReactClass({
	displayName: 'TopicItem',
	mixins: [Mixin, StoreEventsMixin, KeepItemInState],

	statics: {
		inputType: mimeTypes[TOPIC],
	},

	backingStore: Store,

	propTypes: {
		parentPath: PropTypes.string,
	},

	getInitialState() {
		let item = Store.getForumItem(this.getItemId());
		return item ? { item } : {};
	},

	getHref(item) {
		return (this.props.parentPath || '').concat(
			encodeForURI(item.getID()),
			'/'
		);
	},

	renderReplies(item) {
		return item.PostCount > 0 ? (
			<div className="replies">
				{t('replies', { count: item.PostCount })}
			</div>
		) : null;
	},

	renderLikes(item) {
		return item.LikeCount > 0 ? (
			<div className="likes">{t('likes', { count: item.LikeCount })}</div>
		) : null;
	},

	// topics say "posted", comments say "replied"
	renderVerbForPost(item) {
		// confusing that comment is referenced as a post and a post is referred to as a topic.
		return isMimeType(item, mimeTypes[POST]) ? t('replied') : t('posted');
	},

	render() {
		let item = this.getItem();
		let replyTime = item.NewestDescendant.getCreatedTime();
		return (
			<div className="topic-link-wrapper">
				<LuckyCharms item={item} />
				<Link className="topic-link" href={this.getHref(item)}>
					<Avatar entity={item.creator} />
					<div className="wrap">
						<div>
							<div className="attribution">
								<DisplayName entity={item.creator} />
							</div>
							<span className="title">{item.title}</span>
						</div>
						<div className="activity">
							<div className="newest">
								<DisplayName
									entity={item.NewestDescendant.creator}
								/>
								<span>
									{this.renderVerbForPost(
										item.NewestDescendant
									)}{' '}
									<DateTime relative date={replyTime} />
								</span>
							</div>
							{this.renderReplies(item)}
							{this.renderLikes(item)}
						</div>
						<div>
							<span className="arrow-right" />
						</div>
					</div>
				</Link>
			</div>
		);
	},
});
