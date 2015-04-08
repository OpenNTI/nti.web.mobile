'use strict';

import React from 'react';


import AnalyticsStore from 'analytics/Store';
import Actions from '../Actions';
import Api from '../Api';
import {OBJECT_CONTENTS_CHANGED, COMMENT_ADDED, OBJECT_DELETED, COMMENT_SAVED, TOPIC, COMMENT_FORM_ID} from '../Constants';
import {TOPIC_VIEWED} from 'nti.lib.interfaces/models/analytics/MimeTypes';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';
import Store from '../Store';

import ActionLinks from './ActionLinks';
import CommentForm from './CommentForm';
import Err from 'common/components/Error';
import Loading from 'common/components/Loading';
import Notice from 'common/components/Notice';
import {areYouSure} from 'prompts';
import TopicComments from './TopicComments';
import TopicEditor from './TopicEditor';
import TopicHeadline from './TopicHeadline';
import ViewHeader from './widgets/ViewHeader';
import {scoped} from 'common/locale';

// mixins
import KeepItemInState from '../mixins/KeepItemInState';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import Paging from '../mixins/Paging';
import ResourceLoaded from 'analytics/mixins/ResourceLoaded';
import StoreEvents from 'common/mixins/StoreEvents';
import ToggleState from '../mixins/ToggleState';

let t = scoped('FORUMS');
let {EDIT, DELETE} = ActionLinks;

const loadData = 'Topic:LoadData';

const editTopic = 'Topic:editTopic';
const deleteTopic = 'Topic:deleteTopic';
const getTopic = 'Topic:getTopic';
const getPropId = 'Topic:getPropId';
const startAnalyticsEvent = 'Topic:startAnalyticsEvent';
const getTopicId = 'Topic:getTopicId';
const actionClickHandlers = 'Topic:actionClickHandlers';
const saveEdit = 'Topic:saveEdit';
const hideEditForm = 'Topic:hideEditForm';

module.exports = React.createClass({
	displayName: 'Topic',

	mixins: [
		StoreEvents,
		ResourceLoaded,
		NavigatableMixin,
		KeepItemInState,
		ToggleState,
		Paging
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
			let {topicId} = this.props;
			let {result} = event.data || {};
			if (result.ContainerId === decodeFromURI(topicId)) {
				this[loadData](topicId);
			}
		},
		[OBJECT_DELETED]: function(event) {
			let {topicId} = this.props;
			let fullTopicId = decodeFromURI(topicId);
			let o = event.object;
			if (!o.inReplyTo && event.object.ContainerId === fullTopicId) {
				this[loadData](this.props.topicId);
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

	[startAnalyticsEvent]() {
		let {topicId} = this.props;
		console.debug('Begin topic viewed event.');
		this.resourceLoaded(topicId, Store.getCourseId(), TOPIC_VIEWED);
	},

	resumeAnalyticsEvents() {
		this[startAnalyticsEvent]();
	},

	componentDidMount: function() {
		let {topicId} = this.props;
		this[loadData](topicId);
		this[startAnalyticsEvent]();

	},

	componentWillUnmount: function() {
		AnalyticsStore.pushHistory(this[getTopicId](this.props));
		this.resourceUnloaded();
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.topicId !== this.props.topicId) {
			this.setState({
				loading: true
			});
			this[loadData](nextProps.topicId).then(() =>
			{
				this.setState({
					loading: false
				});
			});
		}
	},

	[getTopicId](props=this.props) {
		return decodeFromURI(props.topicId);
	},

	[loadData]: function(topicId=this.props.topicId) {
		return Api.getTopicContents(topicId, this.batchStart(), this.getPageSize())
		.then(
			result => {
				Store.setObject(topicId, result.object);
				Store.setObjectContents(topicId, result.contents);
				this.setState({
					item: result.object,
					itemContents: result.contents
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
		let h = AnalyticsStore.getHistory() || [];
		if (h.length > 0 && h[h.length - 1] === this[getTopicId]) {
			h.length--; // don't include ourselves in the context
		}
		return Promise.resolve(h);
	},

	[editTopic]: function() {
		this.setState({
			editing: true
		});
	},

	[deleteTopic]: function() {
		areYouSure(t('deleteTopicPrompt')).then(() => {
			Actions.deleteTopic(this[getTopic]());
		},
		()=>{});
	},

	[getTopic]: function() {
		return this.getItem() || Store.getObject(this.props.topicId);
	},

	[getPropId]: function() {
		return this.props.topicId;
	},

	[actionClickHandlers]() {
		return {
			[EDIT]: this._editTopic,
			[DELETE]: this._deleteTopic
		};
	},

	[saveEdit]() {
		let val = this.refs.headline.getValue();
		Actions.saveComment(this[getTopic].headline, val);
	},

	[hideEditForm]() {
		this.setState({
			editing: false
		});
	},

	render: function() {

		if (this.state.error) {
			let {error} = this.state;
			return (error || {}).statusCode === 404 ? <div><Notice>This topic could not be found.</Notice></div> : <Err error={error} />;
		}

		if (this.state.loading) {
			return <Loading />;
		}

		if (this.state.deleted) {
			return <div><Notice>This topic has been deleted.</Notice></div>;
		}

		let topic = this[getTopic]();
		let topicContents = Store.getObjectContents(this.props.topicId);
		let numComments = topicContents.TotalItemCount;


		let props = {
			ref: 'headline',
			item: topic.headline,
			onSubmit: this._saveEdit,
			onCompletion: this._hideEditForm,
			onCancel: this._hideEditForm
		};

		return (
			<div>
				<ViewHeader type={TOPIC} />
				{this.state.editing ? <TopicEditor {...props} /> : <TopicHeadline {...props} />}
				<ActionLinks
					item={topic}
					canReply={true}
					numComments={numComments}
					clickHandlers={this[actionClickHandlers]()} />

				<TopicComments topicId={this[getTopicId]()} currentPage={this.currentPage()} />

				<CommentForm key="commentForm"
						ref={COMMENT_FORM_ID}
						id={COMMENT_FORM_ID}
						onCompletion={this._hideCommentForm}
						topic={topic}
						parent={topic.parent()} />

			</div>
		);
	}

});
