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
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var _SHOW_FORM = 'showForm';
var _SHOW_REPLIES = 'showReplies';

var PostItem = React.createClass({

	displayName: 'PostListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			Constants.types.POST
		]
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChanged);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	_storeChanged: function (event) {
		console.debug(event);
	},

	getInitialState: function() {
		return {
			[_SHOW_FORM]: false,
			[_SHOW_REPLIES]: false,
			busy: false
		};
	},

	_deleteComment() {
		this.setState({
			busy: true
		});
		Actions.deleteComment(this.props.item);
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

	_hideForm(){
		this.setState({
			[_SHOW_FORM]: false
		});
	},

	_links(item) {

		var canEdit = item.hasLink('edit');
		var RepliesToggle = item.ReferencedByCount > 0 ? "a" : "span";
		var repliesClick = item.ReferencedByCount > 0 ? this._toggleState.bind(this, _SHOW_REPLIES) : null;
		var numComments = item.ReferencedByCount;
		var toggleClasses = numComments > 0 ? ['disclosure-triangle'] : [];

		if (this.state[_SHOW_REPLIES]) {
			toggleClasses.push('open');
		}

		return ( 
		<ul className="links">
			<li>
				<RepliesToggle className={toggleClasses.join(' ')} onClick={repliesClick}>{t('replies', {count: numComments})}</RepliesToggle>
			</li>
			{isFlag('forumCommentsEnabled') &&
				<li><a onClick={this._toggleState.bind(this, _SHOW_FORM)}>{this.props.linkText||t('reply')}</a></li>
			}
			{canEdit && <li><a onClick={this._editComment}>{this.props.linkText||t('editComment')}</a></li>}
			{canEdit && <li><a onClick={this._deleteComment}>{this.props.linkText||t('deleteComment')}</a></li>}
		</ul>);
	},

	render: function() {
		var {item} = this.props;
		var createdBy = item.Creator;
		var createdOn = item.getCreatedTime();
		var modifiedOn = item.getLastModified();
		var message = item.body;

		var edited = (Math.abs(modifiedOn - createdOn) > 0);
		
		if (this.state.busy) {
			return <Loading />;
		}

		var links = this._links(item);
		var replies = <Replies item={item}
							childComponent={PostItem}
							topic={this.props.topic}
							display={this.state[_SHOW_REPLIES]} />;

		if (item.Deleted) {
			return (
				<div className="postitem deleted">
					<ModeledContentPanel body={message} />
					{item.ReferencedByCount > 0 ? [links, replies] : null}
				</div>
			);
		}

		return (
			<div className="postitem">
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
				</div>
				{links}
				<ReactCSSTransitionGroup transitionName="forum-comments">
					{this.state.showForm && <CommentForm key="commentForm"
						ref='commentForm'
						onCancel={this._hideForm}
						onCompletion={this._hideForm}
						topic={this.props.topic}
						parent={item}
					/>}
				</ReactCSSTransitionGroup>
				{replies}
			</div>
		);

	}

});

module.exports = PostItem;
