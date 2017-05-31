import React from 'react';
import createReactClass from 'create-react-class';
import Transition from 'react-transition-group/CSSTransitionGroup';

import {
	Mixin as ResourceLoaded,
	TOPIC_VIEWED,
	addHistory,
	getHistory
} from 'nti-analytics';

import {decodeFromURI} from 'nti-lib-ntiids';

import {Error as Err, Loading, Mixins, Notice} from 'nti-web-commons';

import {Prompt} from 'nti-web-commons';

import ActionsComp from './Actions';
import CommentForm from './CommentForm';
import TopicComments from './TopicComments';
import TopicEditor from './TopicEditor';
import TopicHeadline from './TopicHeadline';
import ViewHeader from './widgets/ViewHeader';

import * as Actions from '../Actions';
import {getTopicContents} from '../Api';
import {ITEM_CONTENTS_CHANGED, COMMENT_ADDED, ITEM_DELETED, COMMENT_SAVED, TOPIC, COMMENT_FORM_ID} from '../Constants';
import Store from '../Store';

// mixins
import KeepItemInState from '../mixins/KeepItemInState';
import Paging from '../mixins/Paging';

import {StoreEventsMixin} from 'nti-lib-store';
import ToggleState from '../mixins/ToggleState';

import {scoped} from 'nti-lib-locale';
let t = scoped('FORUMS');


export default createReactClass({
	displayName: 'Topic',

	mixins: [
		StoreEventsMixin,
		ResourceLoaded,
		Mixins.NavigatableMixin,
		KeepItemInState,
		ToggleState,
		Paging
	],


	propTypes: {
		topicId: React.PropTypes.string,
		showComments: React.PropTypes.bool
	},

	getDefaultProps () {
		return {
			showComments: true
		};
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[ITEM_CONTENTS_CHANGED] (event) {
			if (event.itemId === this.props.topicId) {
				this.setState({
					loading: false
				});
			}
		},
		[COMMENT_ADDED] (event) {
			let {topicId} = this.props;
			let {result} = event.data || {};
			if (result.ContainerId === decodeFromURI(topicId)) {
				this.loadData(topicId);
			}
		},
		[ITEM_DELETED] (event) {
			let {topicId} = this.props;
			let fullTopicId = decodeFromURI(topicId);
			let o = event.item;
			if (!o.inReplyTo && event.item.ContainerId === fullTopicId) {
				this.loadData(this.props.topicId);
			}
			if (o.getID && o.getID() === fullTopicId) {
				this.setState({
					deleted: true
				});
			}
		},
		[COMMENT_SAVED] (event) {
			if (event.data) {
				this.setState({
					editing: false
				});
			}
		}
	},

	getInitialState () {
		return {
			loading: true,
			deleted: false
		};
	},

	startAnalyticsEvent () {
		let {topicId} = this.props;
		this.resourceLoaded(topicId, Store.getContextID(), TOPIC_VIEWED);
	},

	resumeAnalyticsEvents () {
		this.startAnalyticsEvent();
	},

	componentDidMount () {
		let {topicId} = this.props;
		this.loadData(topicId);
		this.startAnalyticsEvent();

	},

	componentWillUnmount () {
		addHistory(this.getTopicId(this.props));
		this.resourceUnloaded();
	},

	componentWillReceiveProps (nextProps) {
		if (nextProps.topicId !== this.props.topicId) {
			this.setState({
				loading: true
			});
			this.loadData(nextProps.topicId).then(() =>
			{
				this.setState({
					loading: false
				});
			});
		}
	},

	getTopicId (props = this.props) {
		return decodeFromURI(props.topicId);
	},

	loadData (topicId = this.props.topicId) {
		return getTopicContents(topicId, this.batchStart(), this.getPageSize())
			.then(
				result => {
					Store.setForumItem(topicId, result.item);
					Store.setForumItemContents(topicId, result.contents);
					this.setState({
						item: result.item,
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

	analyticsContext () {
		let h = getHistory() || [];
		if (h.length > 0 && h[h.length - 1] === this.getTopicId()) {
			h.length--; // don't include ourselves in the context
		}
		return Promise.resolve(h);
	},

	editTopic () {
		Store.startEdit();
		this.setState({
			editing: true
		});
	},

	deleteTopic () {
		Prompt.areYouSure(t('deleteTopicPrompt')).then(() => {
			Actions.deleteTopic(this.getTopic());
		},
		()=> {});
	},

	getTopic () {
		return this.getItem() || Store.getForumItem(this.props.topicId);
	},

	getPropId () {
		return this.props.topicId;
	},

	saveEdit () {
		let val = this.headline.getValue();
		Actions.saveComment(this.getTopic().headline, val);
		Store.endEdit();
	},

	hideEditForm () {
		Store.endEdit();
		this.setState({
			editing: false
		});
	},

	render () {

		if (this.state.error) {
			let {error} = this.state;
			return (error || {}).statusCode === 404 ? <div><Notice>This topic could not be found.</Notice></div> : <Err error={error} />;
		}

		if (this.state.loading) {
			return <Loading.Mask />;
		}

		if (this.state.deleted) {
			return <div><Notice>This topic has been deleted.</Notice></div>;
		}

		let topic = this.getTopic();

		let props = {
			ref: x => this.headline = x,
			item: topic.headline,
			onSubmit: this.saveEdit,
			onCompletion: this.hideEditForm,
			onCancel: this.hideEditForm
		};

		let {showComments} = this.props;

		return (
			<div>
				<Transition transitionName="fadeOutIn"
					transitionAppear
					transitionAppearTimeout={500}
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}
				>
					<ViewHeader type={TOPIC} />
					{this.state.editing ? <TopicEditor {...props} /> : <TopicHeadline topic={topic} {...props} />}
					<ActionsComp
						item={topic}
						canReply={showComments && topic.hasLink('add')}
						onEdit={this.editTopic}
						onDelete={this.deleteTopic}
						/>

					{showComments && (
						<div>
							<TopicComments topicId={this.getTopicId()} currentPage={this.currentPage()} />

							<CommentForm key="commentForm"
									ref={COMMENT_FORM_ID}
									id={COMMENT_FORM_ID}
									onCompletion={this.hideCommentForm}
									topic={topic}
									parent={topic.parent()} />
						</div>
					)}
				</Transition>
			</div>
		);
	}

});
