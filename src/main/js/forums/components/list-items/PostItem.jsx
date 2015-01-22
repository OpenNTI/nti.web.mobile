/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');
var Actions = require('../../Actions');
var Store = require('../../Store');

var Avatar = require('common/components/Avatar');
var DateTime = require('common/components/DateTime');
var DisplayName = require('common/components/DisplayName');
var Replies = require('../Replies'); 
var ModeledContentPanel = require('modeled-content').Panel;
var t = require('common/locale').scoped('FORUMS');
var isFlag = require('common/Utils').isFlag;
var Loading = require('common/components/LoadingInline');
var CommentForm = require('../CommentForm');
var ReportLink = require('../ReportLink');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Prompt = require('prompts');
var KeepItemInState = require('../../mixins/KeepItemInState');

var _SHOW_FORM = 'showForm';
var _SHOW_REPLIES = 'showReplies';

var PostItem = React.createClass({

	displayName: 'PostListItem',
	mixins: [require('./Mixin'), KeepItemInState],

	statics: {
		inputType: [
			Constants.types.POST
		]
	},

	getInitialState: function() {
		return {
			[_SHOW_FORM]: false,
			[_SHOW_REPLIES]: false,
			busy: false,
			item: null
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChanged);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			busy: false,
			item: nextProps.item||this.props.item
		});
	},

	_storeChanged: function (event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.GOT_COMMENT_REPLIES:
				if(event.comment === this.props.item) {
					this.setState({
						replyCount: event.replies.length
					});
				}
				break;
		}
	},

	_deleteComment: function() {
		Prompt.areYouSure(t('deleteCommentPrompt')).then(
			()=> {
				this.setState({
					busy: true
				});
				Actions.deleteComment(this.props.item);	
			},
			()=>{}
		);
	},

	_toggleState: function(propname, event) {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.setState({
			[propname]: !this.state[propname]
		});
	},

	_hideForm(event){
		if (event.preventDefault) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.setState({
			[_SHOW_FORM]: false
		});
	},

	_links(item) {

		var commentsEnabled = isFlag('forumCommentsEnabled');
		var canEdit =  false && commentsEnabled && item.hasLink('edit');
		var canReport = commentsEnabled && item.hasLink('flag')||item.hasLink('flag.metoo');
		var canReply = commentsEnabled && !item.Deleted;
		var numComments = this.state.replyCount||item.ReferencedByCount;
		var RepliesToggle = numComments > 0 ? "a" : "span";
		var repliesClick = numComments > 0 ? this._toggleState.bind(this, _SHOW_REPLIES) : null;
		var toggleClasses = numComments > 0 ? ['disclosure-triangle'] : [];


		if (this.state[_SHOW_REPLIES]) {
			toggleClasses.push('open');
		}

		return ( 
			<ul key="control-links" className="links">
				<li key="replies-toggle">
					<RepliesToggle className={toggleClasses.join(' ')} onClick={repliesClick}>{t('replies', {count: numComments})}</RepliesToggle>
				</li>
				{canReply &&
					<li key="reply-link">
						<a onClick={this._toggleState.bind(this, _SHOW_FORM)}>{this.props.linkText||t('reply')}</a>
					</li>
				}
				{canEdit &&
					<li key="edit-link"><a onClick={this._editComment}>{this.props.linkText||t('editComment')}</a></li>}
				{canEdit &&
					<li key="delete-link"><a onClick={this._deleteComment}>{this.props.linkText||t('deleteComment')}</a></li>}
				{canReport &&
					<li key="report-link"><ReportLink item={item} /></li>}
			</ul>
		);
	},

	render: function() {
		var item = this._item();
		var createdBy = item.Creator;
		var createdOn = item.getCreatedTime();
		var modifiedOn = item.getLastModified();
		var message = item.body;

		var edited = (Math.abs(modifiedOn - createdOn) > 0);
		
		if (this.state.busy) {
			return <Loading />;
		}

		var links = this._links(item);
		var form = (<ReactCSSTransitionGroup key="formTransition" transitionName="forum-comments">
							{this.state.showForm && <CommentForm key="commentForm"
								ref='commentForm'
								onCancel={this._hideForm}
								onCompletion={this._hideForm}
								topic={this.props.topic}
								parent={item}
							/>}
						</ReactCSSTransitionGroup>);
		var replies = <Replies key="replies" item={item}
							childComponent={PostItem}
							topic={this.props.topic}
							display={this.state[_SHOW_REPLIES]} />;


		if (item.Deleted) {
			return (
				<div className="postitem deleted">
					<ModeledContentPanel body={message} />
					{item.ReferencedByCount > 0 ? [links, form, replies] : null}
				</div>
			);
		}

		return (
			<div className="postitem">
				<div className="post">
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
						{links}
					</div>
				</div>
				{form}
				{replies}
			</div>
		);

	}

});

module.exports = PostItem;
