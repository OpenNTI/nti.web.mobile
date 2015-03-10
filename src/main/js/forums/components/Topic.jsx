'use strict';

import React from 'react';

import Store from '../Store';
import AnalyticsStore from 'analytics/Store';
import Actions from '../Actions';
import Api from '../Api';
import {OBJECT_CONTENTS_CHANGED, COMMENT_ADDED, OBJECT_DELETED, COMMENT_SAVED, TOPIC} from '../Constants';
import {TOPIC_VIEWED} from 'dataserverinterface/models/analytics/MimeTypes';
import NTIID from 'dataserverinterface/utils/ntiids';

import ViewHeader from './widgets/ViewHeader';
import TopicHeadline from './TopicHeadline';
import TopicEditor from './TopicEditor';
import TopicComments from './TopicComments';
import Breadcrumb from 'common/components/Breadcrumb';
import Prompt from 'prompts';
import Notice from 'common/components/Notice';
import Loading from 'common/components/Loading';
import CommentForm from './CommentForm';
import Err from 'common/components/Error';
var t = require('common/locale').scoped('FORUMS');
import ActionLinks from './ActionLinks';
var {EDIT, DELETE} = ActionLinks;

// mixins
import StoreEvents from 'common/mixins/StoreEvents';
import ResourceLoaded from 'analytics/mixins/ResourceLoaded';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import KeepItemInState from '../mixins/KeepItemInState';
import ToggleState from '../mixins/ToggleState';

module.exports = React.createClass({
	displayName: 'TopicView',

	mixins: [
		StoreEvents,
		ResourceLoaded,
		NavigatableMixin,
		KeepItemInState,
		ToggleState
	],


	backingStore: Store,
	backingStoreEventHandlers: {
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
		},
		[COMMENT_SAVED]: function(event) {
			console.debug(event.data);
			if (event.data) {
				this.setState({
					editing: false
				});
			}
		}
	},

	getInitialState: function() {
		return {
			loading: true,
			deleted: false
		};
	},

	componentDidMount: function() {
		var {topicId} = this.props;
		this._loadData(topicId);
		this._resourceLoaded(topicId, Store.getCourseId(), TOPIC_VIEWED);
	},

	componentWillUnmount: function() {
		AnalyticsStore.pushHistory(this._topicId(this.props));
		this._resourceUnloaded();
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.topicId !== this.props.topicId) {
			this._loadData(nextProps.topicId);
		}
	},

	_topicId(props=this.props) {
		return NTIID.decodeFromURI(props.topicId);
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
				this.setState({
					error: reason
				});
			}
		);
	},

	analyticsContext: function() {
		var h = AnalyticsStore.getHistory()||[];
		if (h.length > 0 && h[h.length - 1] === this._topicId()) {
			h.length--; // don't include ourselves in the context
		}
		return Promise.resolve(h);
	},

	__getContext: function() {
		let getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		return getContextProvider();
	},

	_editTopic: function() {
		this.setState({
			editing: true
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
			[EDIT]: this._editTopic,
			[DELETE]: this._deleteTopic
		};
	},

	_saveEdit() {
		var val = this.refs.headline.getValue();
		Actions.saveComment(this._topic().headline, val);
	},

	_hideEditForm() {
		this.setState({
			editing: false
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

		var Tag = this.state.editing ? TopicEditor : TopicHeadline;

		return (
			<div>
				{breadcrumb}
				<ViewHeader type={TOPIC} />
				<Tag ref='headline'
					item={topic.headline}
					onSubmit={this._saveEdit}
					onCompletion={this._hideEditForm}
					onCancel={this._hideEditForm}
				/>
				<ActionLinks
					item={topic}
					replyText={t('addComment')}
					numComments={numComments}
					cssClasses={linksClasses}
					clickHandlers={this._actionClickHandlers()} />

				<TopicComments container={topicContents} topic={topic} />

				<CommentForm key="commentForm"
					ref='commentForm'
					onCompletion={this._hideCommentForm}
					topic={topic}
					parent={topic.parent()}
				/>
			</div>
		);
	}

});
