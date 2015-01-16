/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Actions = require('../Actions');
var Constants = require('../Constants');
var Store = require('../Store');
var t = require('common/locale').scoped('FORUMS');
var CommentForm = require('./CommentForm');

// var AddComment = require('./AddComment');
var isFlag = require('common/Utils').isFlag;


var Replies = React.createClass({

	propTypes: {
		topic: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			replies: null,
			display: false,
			showForm: false
		};
	},

	componentDidMount: function() {
		this._getReplies();
		Store.addChangeListener(this._storeChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChange);
	},

	// componentWillReceiveProps: function(nextProps) {
		
	// },

	_storeChange: function(event) {
		switch(event.type) {
			case Constants.GOT_COMMENT_REPLIES:
				if(event.comment === this.props.item) {
					this.setState({
						replies: event.replies,
						display: true
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

	_toggleCommentForm: function() {
		this.setState({
			showForm: !this.state.showForm
		});
	},

	_dismissCommentForm: function() {
		this.setState({
					showForm: false
				});
	},

	_toggleReplies: function(event) {
		event.preventDefault();
		event.stopPropagation();
		this.setState({
			display: !this.state.display
		});
	},

	_getReplies: function(reload) {
		var {item} = this.props;
		if (item.ReferencedByCount === 0 && !reload) {
			return;
		}
		Actions.getCommentReplies(item);
	},

	_renderReplies: function() {
		if (!this.state.display) {
			return;
		}
		var items = (this.state.replies||[]);
		var Tag = this.props.childComponent;
		return items.map(reply => {
			return (<Tag
						{...this.props}
						key={reply.ID}
						item={reply} />);
		});
	},

	render: function() {
		var {item} = this.props;

		var numComments = item.ReferencedByCount;
		var RepliesTag = item.ReferencedByCount > 0 ? "a" : "span";
		var repliesClick = item.ReferencedByCount > 0 ? this._toggleReplies : null;

		return (
			<div className="replies">
				<ul className="links">
					<li>
						<RepliesTag className="replies-link" onClick={repliesClick}>{t('replies', {count: numComments})}</RepliesTag>
					</li>
					{isFlag('forumCommentsEnabled') &&
						<li><a onClick={this._toggleCommentForm}>{this.props.linkText||t('addComment')}</a></li>
					}
				</ul>
				{this.state.showForm &&
					<ReactCSSTransitionGroup transitionName="forum-comments">
						<CommentForm key="commentForm"
							ref='commentForm'
							onCancel={this._dismissCommentForm}
							topic={this.props.topic}
							parent={item}
						/>
					</ReactCSSTransitionGroup>
				}
				<ReactCSSTransitionGroup transitionName="forum-comments">
					{this._renderReplies()}
				</ReactCSSTransitionGroup>
			</div>
		);
	}

});

module.exports = Replies;
