'use strict';

import React from 'react';
import {types, GOT_COMMENT_REPLIES} from '../../Constants';
import Actions from '../../Actions';
import Store from '../../Store';

import Avatar from 'common/components/Avatar';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import Replies from '../Replies';
import {Panel as ModeledContentPanel} from 'modeled-content';

import Loading from 'common/components/LoadingInline';
import CommentForm from '../CommentForm';
import ActionLinks from '../ActionLinks';

import ReactCSSTransitionGroup from "react/lib/ReactCSSTransitionGroup";
import Prompt from 'prompts';

import NavigatableMixin from 'common/mixins/NavigatableMixin';
import Mixin from './Mixin';
import StoreEvents from 'common/mixins/StoreEvents';
import KeepItemInState from '../../mixins/KeepItemInState';
import ToggleState from '../../mixins/ToggleState';

import NTIID from 'dataserverinterface/utils/ntiids';

var {EDIT, DELETE, REPLIES, REPLY} = ActionLinks;
var t = require('common/locale').scoped('FORUMS');
var _SHOW_FORM = 'showForm';
var _SHOW_REPLIES = 'showReplies';

const gotCommentReplies = 'PostItem:gotCommentReplies';

var PostItem = React.createClass({

	displayName: 'PostListItem',

	mixins: [
		NavigatableMixin,
		Mixin,
		StoreEvents,
		KeepItemInState,
		ToggleState
	],

	backingStore: Store,
	backingStoreEventHandlers: {
		[GOT_COMMENT_REPLIES]: gotCommentReplies
	},

	statics: {
		inputType: [
			types.POST
		]
	},

	getInitialState: function() {
		return {
			[_SHOW_FORM]: false,
			[_SHOW_REPLIES]: false,
			busy: false,
			item: null,
			editing: false
		};
	},

	componentWillReceiveProps: function(nextProps) {
		if (this.props.item !== nextProps.item) {
			this.setState({
				busy: false,
				item: nextProps.item||this.props.item
			});
		}
	},

	[gotCommentReplies]: function (event) {
		if(event.comment === this.props.item) {
			this.setState({
				replyCount: event.replies.length
			});
		}
	},

	_editClick: function() {
		this.setState({
			editing: true
		});
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

	_hideForm(event){
		if (event.preventDefault) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.setState({
			[_SHOW_FORM]: false
		});
	},

	_repliesClick: function() {
		if (this._numComments() > 0) {
			this._toggleState(_SHOW_REPLIES);
		}
	},

	_actionClickHandlers() {
		return {
			[REPLIES]: this._repliesClick,
			[EDIT]: this._editClick,
			[DELETE]: this._deleteComment,
			[REPLY]: this._toggleState.bind(this, _SHOW_FORM)
		};
	},

	_commentCompletion(event) {
		this.setState({
			[_SHOW_REPLIES]: true
		});
		this._hideForm(event);
	},

	_hideEditForm() {
		this.setState({
			editing: false
		});
	},

	_numComments: function() {
		return this.state.replyCount||this.props.item.ReferencedByCount;
	},

	render: function() {
		var item = this._item();
		if (!item) {
			return <div>No item?</div>;
		}
		var createdBy = item.Creator;
		var createdOn = item.getCreatedTime();
		var modifiedOn = item.getLastModified();
		var message = item.body;
		var numComments = this._numComments();
		var {topic} = this.props;
		var topicId = topic.getID();
		var href = this.makeHref('/' + NTIID.encodeForURI(topicId) + '/' + NTIID.encodeForURI(this._itemId()) + '/', false);

		var edited = (Math.abs(modifiedOn - createdOn) > 0);
		
		if (this.state.busy) {
			return <Loading />;
		}

		var linksClasses = {
			replies:[]
		};

		if (this.state[_SHOW_REPLIES]) {
			linksClasses.replies.push('open');
		}

		var links = <ActionLinks
						key='actionlinks'
						item={item}
						numComments={numComments}
						cssClasses={linksClasses}
						clickHandlers={this._actionClickHandlers()} />;

		var form = (<ReactCSSTransitionGroup key="formTransition" transitionName="forum-comments">
							{this.state.showForm && <CommentForm key="commentForm"
								ref='commentForm'
								onCancel={this._hideForm}
								onCompletion={this._commentCompletion}
								topic={this.props.topic}
								parent={item}
							/>}
						</ReactCSSTransitionGroup>);
		var replies = <Replies key="replies" item={item}
							childComponent={PostItem}
							topic={this.props.topic}
							display={this.state[_SHOW_REPLIES]}
							className={this.state[_SHOW_REPLIES] ? 'visible' : ''} />;


		if (item.Deleted) {
			return (
				<div className="postitem deleted">
					<div className="post">
						<div className="wrap">
							<div className="meta">
								<DateTime date={createdOn} relative={true}/>
							</div>
							<div className="message">
								<ModeledContentPanel body={message} />
							</div>
							{item.ReferencedByCount > 0 ? [links, form, replies] : null}
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="postitem">
				<a href={href} className="threadlink"><span className="arrow-right"/></a>
				<div className="post">
					<Avatar username={createdBy} className="avatar"/>
					<div className="wrap">
						<div className="meta">
							<DisplayName username={createdBy} className="name"/>
							<DateTime date={createdOn} relative={true}/>
						</div>
						<div className="message">
							{this.state.editing ?
								<CommentForm
									editItem={item}
									onCompletion={this._hideEditForm}
									onCancel={this._hideEditForm}/> :
								<ModeledContentPanel body={message} />
							}
							{edited && <DateTime date={modifiedOn} format="LLL" prefix="Modified: "/>}
						</div>
						{[links, form]}
					</div>
				</div>
			</div>
		);

	}

});

module.exports = PostItem;
