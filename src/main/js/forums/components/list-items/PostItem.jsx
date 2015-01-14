/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');
var Avatar = require('common/components/Avatar');
var DateTime = require('common/components/DateTime');
var DisplayName = require('common/components/DisplayName');
var ModeledContentPanel = require('modeled-content').Panel;
var Actions = require('../../Actions');
var Store = require('../../Store');
var t = require('common/locale').scoped('FORUMS');

var PostItem = React.createClass({

	displayName: 'PostListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			Constants.types.POST
		]
	},

	getInitialState: function() {
		return {
			replies: null,
			displayReplies: true
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChange);
	},

	_storeChange: function(event) {
		if (event.type === Constants.GOT_COMMENT_REPLIES && event.comment === this.props.item) {
			this.setState({
				replies: event.replies,
				displayReplies: true
			});
		}
	},

	_toggleReplies: function(event) {
		event.preventDefault();
		event.stopPropagation();
		if (!this.state.replies) {
			this._getReplies();
		}
		else {
			var display = !this.state.displayReplies;
			this.setState({
				displayReplies: display
			});
		}
	},

	_getReplies: function() {
		var {item} = this.props;
		if (item.ReferencedByCount === 0) {
			return;
		}
		Actions.getCommentReplies(item);
	},

	_renderReplies: function() {
		if (!this.state.displayReplies) {
			return;
		}
		var items = (this.state.replies||[]);
		return items.map(reply => {
			return <PostItem {...this.props} key={reply.ID} item={reply} />;
		});
	},

	render: function() {
		var {item} = this.props;
		var createdBy = item.Creator;
		var createdOn = item.getCreatedTime();
		var modifiedOn = item.getLastModified();
		var message = item.body;

		var edited = (Math.abs(modifiedOn - createdOn) > 0);
		var canEdit = item.hasLink('edit') && false;

		var RepliesTag = item.ReferencedByCount > 0 ? React.DOM.a : React.DOM.span;
		var repliesClick = item.ReferencedByCount > 0 ? this._toggleReplies : null;

		return (
			<div className="feedback item">
				<Avatar username={createdBy} className="avatar"/>
				<div className="wrap">
					<div className="meta">
						<DisplayName username={createdBy} className="name"/>
						<DateTime date={createdOn} relative={true}/>
					</div>
					<div className="message">
						<ModeledContentPanel body={message} />
						{edited && <DateTime date={modifiedOn} format="LLL" prefix="Modified: "/>}
					</div>

					<RepliesTag className="replies-link" onClick={repliesClick}>{t('replies', {count: item.ReferencedByCount})}</RepliesTag>
				{canEdit &&
					<div className="footer">
						<a href="#" className="link edit">Edit</a>
						<a href="#" className="link delete">Delete</a>
					</div>
				}
				</div>
				<div className="replies">
					{this._renderReplies()}
				</div>
			</div>
		);

	}

});

module.exports = PostItem;
