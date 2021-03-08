import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import classnames from 'classnames';

import {
	DateTime,
	Loading,
	LuckyCharms,
	Mixins,
	Prompt,
} from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import { encodeForURI } from '@nti/lib-ntiids';
import { StoreEventsMixin } from '@nti/lib-store';
import Avatar from 'internal/common/components/Avatar';
import DisplayName from 'internal/common/components/DisplayName';
import { Panel as ModeledContentPanel } from 'internal/modeled-content';

import KeepItemInState from '../../mixins/KeepItemInState';
import ToggleState from '../../mixins/ToggleState';
import { mimeTypes, GOT_COMMENT_REPLIES, POST } from '../../Constants';
import * as Actions from '../../Actions';
import Store from '../../Store';
import CommentForm from '../CommentForm';
import ActionsComp from '../Actions';

import Mixin from './Mixin';

const t = scoped('forums.topic', {
	post: {
		deletePrompt: 'Delete this comment?',
	},
	replies: {
		one: '1 Comment',
		other: '%(count)s Comments',
	},
});

const SHOW_REPLIES = 'showReplies';

const gotCommentReplies = 'PostItem:gotCommentRepliesHandler';

export default createReactClass({
	displayName: 'list-items:PostItem',

	mixins: [
		Mixins.NavigatableMixin,
		Mixin,
		StoreEventsMixin,
		KeepItemInState,
		ToggleState,
	],

	backingStore: Store,
	backingStoreEventHandlers: {
		[GOT_COMMENT_REPLIES]: gotCommentReplies,
	},

	statics: {
		inputType: mimeTypes[POST],
	},

	propTypes: {
		item: PropTypes.object,
		topic: PropTypes.object.isRequired,
		asHeadline: PropTypes.bool,
		detailLink: PropTypes.bool,
	},

	getInitialState() {
		return {
			[SHOW_REPLIES]: false,
			busy: false,
			item: null,
			editing: false,
			deleted: false,
		};
	},

	getDefaultProps() {
		return {
			detailLink: true,
		};
	},

	componentDidUpdate(prevProps) {
		if (this.props.item !== prevProps.item) {
			this.setState({
				busy: false,
				item: this.props.item || prevProps.item, //wtf? this doesn't allow blanking out?
			});
		}
	},

	[gotCommentReplies](event) {
		if (event.comment === this.props.item) {
			this.setState({
				replyCount: event.replies.length,
			});
		}
	},

	onEditClick() {
		Store.startEdit();
		this.setState({
			editing: true,
		});
	},

	onDeleteComment() {
		Prompt.areYouSure(t('post.deletePrompt')).then(
			() => {
				this.setState({
					busy: true,
				});
				Actions.deleteComment(this.props.item);
			},
			() => {}
		);
	},

	commentCompletion(event) {
		this.setState({
			[SHOW_REPLIES]: true,
		});
		this.hideForm(event);
	},

	onHideEditForm() {
		Store.endEdit();
		this.setState({
			editing: false,
		});
	},

	getNumberOfComments() {
		return this.state.replyCount || this.props.item.ReferencedByCount || 0;
	},

	render() {
		const item = this.getItem();
		if (!item) {
			return <div>No item?</div>;
		}

		const createdBy = item.creator;
		const createdOn = item.getCreatedTime();
		const modifiedOn = item.getLastModified();
		const message = item.body;
		const numComments = this.getNumberOfComments();
		const href = this.makeHref(
			'/discussions/' + encodeForURI(this.getItemId()) + '/',
			false
		);

		const edited = Math.abs(modifiedOn - createdOn) > 0;

		const {
			state: { busy, editing },
			props: { detailLink, asHeadline, topic },
		} = this;

		if (busy) {
			return <Loading.Ellipse className="post-item" />;
		}

		if (item.Deleted) {
			return (
				<div className="postitem deleted">
					{detailLink && (
						<a href={href} className="threadlink">
							<span className="num-comments">
								{t('replies', { count: numComments })}
							</span>
							<span className="arrow-right" />
						</a>
					)}
					<div className="post">
						<div className="wrap">
							<div className="message">
								<ModeledContentPanel body={message} />
							</div>
						</div>
					</div>
				</div>
			);
		}

		if (editing) {
			return (
				<CommentForm
					topic={topic}
					editItem={item}
					onCompletion={this.onHideEditForm}
					onCancel={this.onHideEditForm}
				/>
			);
		}

		let classes = classnames(
			{
				headline: asHeadline,
			},
			'postitem'
		);

		return (
			<div className={classes}>
				<LuckyCharms item={item} />
				{detailLink && (
					<a href={href} className="threadlink">
						<span className="num-comments">
							{t('replies', { count: numComments })}
						</span>
						<span className="arrow-right" />
					</a>
				)}
				<div className="post">
					<Avatar entity={createdBy} />
					<div className="wrap">
						<div className="meta">
							<DisplayName entity={createdBy} className="name" />
							<DateTime date={createdOn} relative />
						</div>
						<div className="message">
							<ModeledContentPanel body={message} />
							{edited && (
								<DateTime
									date={modifiedOn}
									format={DateTime.MONTH_NAME_DAY_YEAR_TIME}
									prefix="Modified: "
								/>
							)}
						</div>
						<ActionsComp
							item={item}
							canReply={asHeadline && topic.hasLink('add')}
							onEdit={this.onEditClick}
							onDelete={this.onDeleteComment}
						/>
					</div>
				</div>
			</div>
		);
	},
});
