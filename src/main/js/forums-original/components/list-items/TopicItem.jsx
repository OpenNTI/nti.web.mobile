'use strict';

var React = require('react');
var Constants = require('../../Constants');
var Store = require('../../Store');
var DisplayName = require('common/components/DisplayName').default;
var DateTime = require('common/components/DateTime');
var NTIID = require('dataserverinterface/utils/ntiids');
var Link = require('react-router-component').Link;
var {isMimeType} = require('common/utils/mimetype');
var t = require('common/locale').scoped('FORUMS');
var KeepItemInState = require('../../mixins/KeepItemInState');
/**
 * For lists of Topics, this is the row item.
 */
module.exports = React.createClass({
	displayName: 'TopicListItem',
	mixins: [require('./Mixin'), KeepItemInState],

	statics: {
		inputType: [
			Constants.types.TOPIC
		]
	},

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
		return (this.props.parentPath||'').concat(NTIID.encodeForURI(item.getID()),'/');
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
		return isMimeType(item, Constants.types.POST) ? t('replied') : t('posted');
	},

	render: function() {
		var item = this._item();
		var replyTime = item.NewestDescendant.getCreatedTime();
		return (
			<Link className="topic-link" href={this._href(item)}>
				<div><span className="title">{item.title}</span></div>
				<div className="activity">
					<div className="newest">
						<DisplayName username={item.NewestDescendant.Creator} />
						<span>{this._verbForPost(item.NewestDescendant)} <DateTime relative={true} date={replyTime}/></span>
					</div>
					{this._replies(item)}
					{this._likes(item)}
				</div>
				<div><span className="arrow-right" /></div>
			</Link>
		);
	}
});
