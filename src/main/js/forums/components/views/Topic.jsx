/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Store = require('../../Store');
var Actions = require('../../Actions');
var Api = require('../../Api');
var Constants = require('../../Constants');
var {OBJECT_CONTENTS_CHANGED, COMMENT_ADDED, OBJECT_DELETED} = Constants;
var NTIID = require('dataserverinterface/utils/ntiids');

var TopicHeadline = require('../TopicHeadline');
var TopicComments = require('../TopicComments');
var Breadcrumb = require('common/components/Breadcrumb');
var Prompt = require('prompts');
var Notice = require('common/components/Notice');
var Loading = require('common/components/Loading');
var CommentForm = require('../CommentForm');
var Err = require('common/components/Error');
var t = require('common/locale').scoped('FORUMS');
var ActionLinks = require('../ActionLinks');
var {REPLY, REPLIES, DELETE} = ActionLinks;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var TOPIC_VIEWED_EVENT = require('analytics/Constants').TOPIC_VIEWED_EVENT;

var _SHOW_FORM = 'showForm';
var _SHOW_REPLIES = 'showReplies';

module.exports = React.createClass({

	mixins: [
		require('analytics/mixins/ResourceLoaded'),
		require('common/mixins/NavigatableMixin'),
		require('../../mixins/KeepItemInState'),
		require('../../mixins/ToggleState')
	],

	getInitialState: function() {
		return {
			loading: true,
			deleted: false,
			showComments: true
		};
	},

	componentDidMount: function() {
		var {topicId} = this.props;
		Store.addChangeListener(this._storeChanged);
		this._loadData(topicId);
		this._resourceLoaded(topicId, Store.getCourseId(), TOPIC_VIEWED_EVENT);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
		this._resourceUnloaded();
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.topicId !== this.props.topicId) {
			this._loadData(nextProps.topicId);
		}
	},

	_eventHandlers: {

		[OBJECT_CONTENTS_CHANGED]: function(event) {
			if (event.objectId === this.props.topicId) {
				this.setState({
					loading: false
				});
			}
		},
		[COMMENT_ADDED]: function(event) {
			var {topicId} = this.props;
			var {result} = event.data||{};
			if (result.ContainerId === NTIID.decodeFromURI(topicId)) {
				this._loadData(topicId);
			}
		},
		[OBJECT_DELETED]: function(event) {
			var {topicId} = this.props;
			var fullTopicId = NTIID.decodeFromURI(topicId);
			var o = event.object;
			if (!o.inReplyTo && event.object.ContainerId === fullTopicId) {
				this._loadData(this.props.topicId);	
			}
			if (o.getID && o.getID() === fullTopicId) {
				this.setState({
					deleted: true
				});
			}
		}
	},

	_storeChanged: function(event) {
		var h = this._eventHandlers[event.type];
		if(h) {
			return h.call(this, event);
		}
	},

	_loadData: function(topicId=this.props.topicId) {
		Api.getTopicContents(topicId)
		.then(
			result => {
				Store.setObject(topicId, result.object);
				Store.setObjectContents(topicId, result.contents);
				this.setState({
					item: result.object
				});
			},
			reason => {
				// console.error('Failed to load topic contents.', reason);
				this.setState({
					error: reason
				});
			}
		);
	},

	__getContext: function() {
		var getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		var href = this.makeHref(this.getPath());
		var topic = this._topic();
		var title = topic && topic.headline ? topic.headline.title : 'Topic';
		return getContextProvider().then(context => {
			context.push({
				// label: 'Topic',
				label: title,
				href: href
			});
			return context;
		});
	},

	_deleteTopic: function() {
		Prompt.areYouSure(t('deleteTopicPrompt')).then(() => {
			Actions.deleteTopic(this._topic());
		},
		()=>{});
	},

	_topic: function() {
		return this._item()||Store.getObject(this.props.topicId);
	},

	_getPropId: function() {
		return this.props.topicId;
	},

	_actionClickHandlers() {
		return {
			[REPLIES]: this._toggleState.bind(this, _SHOW_REPLIES),
			[DELETE]: this._deleteTopic,
			[REPLY]: this._toggleState.bind(this, _SHOW_FORM)
		};
	},

	_hideForm() {
		this.setState({
			showForm: false
		});
	},

	render: function() {

		var breadcrumb = <Breadcrumb contextProvider={this.__getContext}/>;

		if (this.state.error) {
			var {error} = this.state;
			return (error||{}).statusCode === 404 ? <div>{breadcrumb}<Notice>This topic could not be found.</Notice></div> : <Err error={error} />;
		}

		if (this.state.loading) {
			return <Loading />;
		}

		if (this.state.deleted) {
			return <div>
				{breadcrumb}
				<Notice>This topic has been deleted.</Notice>
			</div>;
		}

		var topic = this._topic();
		var topicContents = Store.getObjectContents(this.props.topicId);
		var numComments = topicContents.TotalItemCount;
		var linksClasses = {replies: []};

		if (this.state[_SHOW_REPLIES]) {
			linksClasses.replies.push('open');
		}

		var form = (<ReactCSSTransitionGroup key="formTransition" transitionName="forum-comments">
						{this.state.showForm && <CommentForm key="commentForm"
							ref='commentForm'
							onCancel={this._hideForm}
							onCompletion={this._hideForm}
							topic={topic}
							parent={topic.parent()}
						/>}
					</ReactCSSTransitionGroup>);

		return (
			<div>
				{breadcrumb}
				<TopicHeadline post={topic.headline} />
				<ActionLinks
					item={topic}
					numComments={numComments}
					cssClasses={linksClasses}
					clickHandlers={this._actionClickHandlers()} />
				{form}
				{this.state[_SHOW_REPLIES] && <TopicComments container={topicContents} topic={topic} />}
			</div>
		);
	}

});
