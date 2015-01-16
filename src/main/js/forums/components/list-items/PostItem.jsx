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
var AddComment = require('../AddComment');
var Actions = require('../../Actions');
var Store = require('../../Store');
var t = require('common/locale').scoped('FORUMS');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var isFlag = require('common/Utils').isFlag;

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
			displayReplies: true,
			showForm: false
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChange);
	},

	_storeChange: function(event) {
		switch(event.type) {
			case Constants.GOT_COMMENT_REPLIES:
				if(event.comment === this.props.item) {
					this.setState({
						replies: event.replies,
						displayReplies: true
					});
				}
				break;

			case Constants.COMMENT_ADDED:
				var {item} = this.props;
				var {parent, result} = event.data;
				if (parent === item || result.inReplyTo === item.getID()) {
					this._getReplies(true);
				}
				break;
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

	_getReplies: function(reload) {
		var {item} = this.props;
		if (item.ReferencedByCount === 0 && !reload) {
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
			return (<PostItem
						{...this.props}
						key={reply.ID}
						item={reply} />);
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

		var numComments = item.ReferencedByCount;
		var RepliesTag = item.ReferencedByCount > 0 ? "a" : "span";
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
					<ul className="links">
						<li><RepliesTag
							className="replies-link"
							onClick={repliesClick}>
								{t('replies', {count: numComments})}
							</RepliesTag>
						</li>
						{isFlag('forumCommentsEnabled') &&
							<AddComment linkText={t('replyLink')} parent={item} topic={this.props.topic} />
						}
					</ul>
				{canEdit &&
					<div className="footer">
						<a href="#" className="link edit">Edit</a>
						<a href="#" className="link delete">Delete</a>
					</div>
				}
				</div>
				<div className="replies">
					<ReactCSSTransitionGroup transitionName="forum-comments">
						{this._renderReplies()}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);

	}

});

module.exports = PostItem;
