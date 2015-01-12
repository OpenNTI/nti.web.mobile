'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');
var DisplayName = require('common/components/DisplayName');
var DateTime = require('common/components/DateTime');
var NTIID = require('dataserverinterface/utils/ntiids');
var Link = require('react-router-component').Link;
var t = require('common/locale').scoped('FORUMS');

/**
 * For lists of Topics, this is the row item.
 */
module.exports = React.createClass({
	displayName: 'TopicListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			Constants.types.TOPIC
		]
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
	
	render: function() {
		var {item} = this.props;
		var replyTime = item.NewestDescendant.getCreatedTime();
		return (
			<Link className="topic-link" href={this._href(item)}>
				<div><span className="title">{item.title}</span></div>
				<div className="activity">
					<div className="newest">
						<DisplayName username={item.NewestDescendant.Creator} />
						<span>replied <DateTime relative={true} date={replyTime}/></span>
					</div>
					{this._replies(item)}
					{this._likes(item)}
				</div>
				<div><span className="arrow-right" /></div>
			</Link>
		);
	}
});
