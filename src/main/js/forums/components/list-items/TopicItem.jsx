'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');
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

	render: function() {
		var {item} = this.props;
		return (
			<Link className="topic-link" href={this._href(item)}>
				<div><span className="title">{item.title}</span></div>
				<div className="activity">
					<div className="newest">{item.NewestDescendant.Creator} replied 6 days ago </div>
					<div className="replies">{t('replies', {count: item.PostCount})}</div>
					<div className="likes">{t('likes', {count: item.LikeCount})}</div>
				</div>
				<div><span className="arrow-right" /></div>
			</Link>
		);
	}
});
