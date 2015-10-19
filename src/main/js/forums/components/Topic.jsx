import React from 'react';
import Transition from 'react-addons-css-transition-group';

import AnalyticsStore from 'analytics/Store';

import {TOPIC_VIEWED} from 'nti.lib.interfaces/models/analytics/MimeTypes';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Err from 'common/components/Error';
import Loading from 'common/components/Loading';
import Notice from 'common/components/Notice';

import {areYouSure} from 'prompts';

import ActionLinks from './ActionLinks';
import {ActionLinkConstants} from './ActionLinks';
import CommentForm from './CommentForm';
import TopicComments from './TopicComments';
import TopicEditor from './TopicEditor';
import TopicHeadline from './TopicHeadline';
import ViewHeader from './widgets/ViewHeader';

import * as Actions from '../Actions';
import {getTopicContents} from '../Api';
import {OBJECT_CONTENTS_CHANGED, COMMENT_ADDED, OBJECT_DELETED, COMMENT_SAVED, TOPIC, COMMENT_FORM_ID} from '../Constants';
import Store from '../Store';

// mixins
import KeepItemInState from '../mixins/KeepItemInState';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import Paging from '../mixins/Paging';
import ResourceLoaded from 'analytics/mixins/ResourceLoaded';
import StoreEvents from 'common/mixins/StoreEvents';
import ToggleState from '../mixins/ToggleState';

import {scoped} from 'common/locale';
let t = scoped('FORUMS');


export default React.createClass({
	displayName: 'Topic',

	mixins: [
		StoreEvents,
		ResourceLoaded,
		NavigatableMixin,
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
		[OBJECT_CONTENTS_CHANGED] (event) {
			if (event.objectId === this.props.topicId) {
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
		[OBJECT_DELETED] (event) {
			let {topicId} = this.props;
			let fullTopicId = decodeFromURI(topicId);
			let o = event.object;
			if (!o.inReplyTo && event.object.ContainerId === fullTopicId) {
				this.loadData(this.props.topicId);
			}
			if (o.getID && o.getID() === fullTopicId) {
				this.setState({
					deleted: true
				});
			}
		},
		[COMMENT_SAVED] (event) {
			console.debug(event.data);
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
		console.debug('Begin topic viewed event.');
		this.resourceLoaded(topicId, Store.getPackageId(), TOPIC_VIEWED);
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
		AnalyticsStore.pushHistory(this.getTopicId(this.props));
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

	analyticsContext () {
		let h = AnalyticsStore.getHistory() || [];
		if (h.length > 0 && h[h.length - 1] === this.getTopicId()) {
			h.length--; // don't include ourselves in the context
		}
		return Promise.resolve(h);
	},

	editTopic () {
		this.setState({
			editing: true
		});
	},

	deleteTopic () {
		areYouSure(t('deleteTopicPrompt')).then(() => {
			Actions.deleteTopic(this.getTopic());
		},
		()=> {});
	},

	getTopic () {
		return this.getItem() || Store.getObject(this.props.topicId);
	},

	getPropId () {
		return this.props.topicId;
	},

	actionClickHandlers () {
		return {
			[ActionLinkConstants.EDIT]: this.editTopic,
			[ActionLinkConstants.DELETE]: this.deleteTopic
		};
	},

	saveEdit () {
		let val = this.refs.headline.getValue();
		Actions.saveComment(this.getTopic().headline, val);
	},

	hideEditForm () {
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
			return <Loading />;
		}

		if (this.state.deleted) {
			return <div><Notice>This topic has been deleted.</Notice></div>;
		}

		let topic = this.getTopic();
		let topicContents = Store.getObjectContents(this.props.topicId);
		let numComments = topicContents.TotalItemCount;


		let props = {
			ref: 'headline',
			item: topic.headline,
			onSubmit: this.saveEdit,
			onCompletion: this.hideEditForm,
			onCancel: this.hideEditForm
		};

		let {showComments} = this.props;

		return (
			<div>
				<Transition transitionName="fadeOutIn" transitionAppear>
					<ViewHeader type={TOPIC} />
					{this.state.editing ? <TopicEditor {...props} /> : <TopicHeadline topic={topic} {...props} />}
					<ActionLinks
						item={topic}
						canReply={showComments}
						numComments={numComments}
						clickHandlers={this.actionClickHandlers()} />

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
