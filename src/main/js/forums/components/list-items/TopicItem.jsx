'use strict';

import React from 'react';
import {mimeTypes, TOPIC, POST} from '../../Constants';
import Store from '../../Store';
import DisplayName from 'common/components/DisplayName';
import Avatar from 'common/components/Avatar';
import DateTime from 'common/components/DateTime';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import {Link} from 'react-router-component';
import {isMimeType} from 'common/utils/mimetype';
import Mixin from './Mixin';
import KeepItemInState from '../../mixins/KeepItemInState';
import StoreEvents from 'common/mixins/StoreEvents';
import {scoped} from 'common/locale';
const t = scoped('FORUMS');

/**
 * For lists of Topics, this is the row item.
 */
module.exports = React.createClass({
	displayName: 'TopicListItem',
	mixins: [
		Mixin,
		StoreEvents,
		KeepItemInState
	],

	statics: {
		inputType: [
			mimeTypes[TOPIC]
		]
	},

	backingStore: Store,

	componentWillMount: function() {
		var item = Store.getObject(this._itemId());
		if (item) {
			this.setState({
				item: item
			});
		}
	},

	getInitialState: function() {
		return {};
	},

	_href: function(item) {
		return (this.props.parentPath||'').concat(encodeForURI(item.getID()),'/');
	},

	_replies: function(item) {
		return item.PostCount > 0 ? <div className="replies">{t('replies', {count: item.PostCount})}</div> : null;
	},

	_likes: function(item) {
		return item.LikeCount > 0 ? <div className="likes">{t('likes', {count: item.LikeCount})}</div>	: null;
	},

	// topics say "posted", comments say "replied"
	_verbForPost: function(item) {
		// confusing that comment is referenced as a post and a post is referred to as a topic.
		return isMimeType(item, mimeTypes[POST]) ? t('replied') : t('posted');
	},

	render: function() {
		var item = this._item();
		var replyTime = item.NewestDescendant.getCreatedTime();
		return (
			<Link className="topic-link" href={this._href(item)}>
				<Avatar username={item.Creator} />
				<div className="wrap">
					<div>
						<div className="attribution"><DisplayName username={item.Creator} /></div>
						<span className="title">{item.title}</span>
					</div>
					<div className="activity">
						<div className="newest">
							<DisplayName username={item.NewestDescendant.Creator} />
							<span>{this._verbForPost(item.NewestDescendant)} <DateTime relative={true} date={replyTime}/></span>
						</div>
						{this._replies(item)}
						{this._likes(item)}
					</div>
					<div><span className="arrow-right" /></div>
				</div>
			</Link>
		);
	}
});
