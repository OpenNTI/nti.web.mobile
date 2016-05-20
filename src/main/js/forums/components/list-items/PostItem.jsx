import React from 'react';
import classnames from 'classnames';
import {mimeTypes, GOT_COMMENT_REPLIES, POST} from '../../Constants';
import * as Actions from '../../Actions';
import Store from '../../Store';

import Avatar from 'common/components/Avatar';
import {DateTime} from 'nti-web-commons';
import DisplayName from 'common/components/DisplayName';
import Loading from 'common/components/TinyLoader';

import {Panel as ModeledContentPanel} from 'modeled-content';

import {Placeholder as Video} from 'video';

import CommentForm from '../CommentForm';
import ActionsComp from '../Actions';

import {areYouSure} from 'prompts';

import NavigatableMixin from 'common/mixins/NavigatableMixin';
import Mixin from './Mixin';
import {StoreEventsMixin} from 'nti-lib-store';
import KeepItemInState from '../../mixins/KeepItemInState';
import ToggleState from '../../mixins/ToggleState';
import LuckyCharms from 'common/components/LuckyCharms';

import {encodeForURI} from 'nti-lib-ntiids';

const t = require('nti-lib-locale').scoped('FORUMS');
const SHOW_REPLIES = 'showReplies';

const gotCommentReplies = 'PostItem:gotCommentRepliesHandler';

const widgets = {
	['application/vnd.nextthought.embeddedvideo'] (_, props) {
		let {widget} = props; //eslint-disable-line react/prop-types
		return React.createElement(Video, {src: widget.embedURL});
	}
};


export default React.createClass({
	displayName: 'list-items:PostItem',

	mixins: [
		NavigatableMixin,
		Mixin,
		StoreEventsMixin,
		KeepItemInState,
		ToggleState
	],

	backingStore: Store,
	backingStoreEventHandlers: {
		[GOT_COMMENT_REPLIES]: gotCommentReplies
	},

	statics: {
		inputType: mimeTypes[POST]
	},


	propTypes: {
		item: React.PropTypes.object,
		asHeadline: React.PropTypes.bool,
		detailLink: React.PropTypes.bool
	},

	getInitialState () {
		return {
			[SHOW_REPLIES]: false,
			busy: false,
			item: null,
			editing: false,
			deleted: false
		};
	},

	getDefaultProps () {
		return {
			detailLink: true
		};
	},

	componentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.setState({
				busy: false,
				item: nextProps.item || this.props.item
			});
		}
	},

	[gotCommentReplies] (event) {
		if(event.comment === this.props.item) {
			this.setState({
				replyCount: event.replies.length
			});
		}
	},

	onEditClick () {
		Store.startEdit();
		this.setState({
			editing: true
		});
	},

	onDeleteComment () {
		areYouSure(t('deleteCommentPrompt')).then(
			()=> {
				this.setState({
					busy: true
				});
				Actions.deleteComment(this.props.item);
			},
			()=> {}
		);
	},


	commentCompletion (event) {
		this.setState({
			[SHOW_REPLIES]: true
		});
		this.hideForm(event);
	},

	onHideEditForm () {
		Store.endEdit();
		this.setState({
			editing: false
		});
	},

	getNumberOfComments () {
		return this.state.replyCount || this.props.item.ReferencedByCount;
	},

	render () {
		let item = this.getItem();
		if (!item) {
			return <div>No item?</div>;
		}
		let createdBy = item.creator;
		let createdOn = item.getCreatedTime();
		let modifiedOn = item.getLastModified();
		let message = item.body;
		let numComments = this.getNumberOfComments();
		let href = this.makeHref('/' + encodeForURI(this.getItemId()) + '/', false);

		let edited = (Math.abs(modifiedOn - createdOn) > 0);

		if (this.state.busy) {
			return <Loading className="post-item"/>;
		}


		if (item.Deleted) {
			return (
				<div className="postitem deleted">
					{this.props.detailLink && <a href={href} className="threadlink"><span className="num-comments">{t('replies', {count: numComments})}</span><span className="arrow-right"/></a>}
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

		if (this.state.editing) {
			return (
				<CommentForm
					editItem={item}
					onCompletion={this.onHideEditForm}
					onCancel={this.onHideEditForm}/>
			);
		}

		let classes = classnames({
			'headline': this.props.asHeadline
		}, 'postitem');

		return (
			<div className={classes}>
				<LuckyCharms item={item} />
				{this.props.detailLink && <a href={href} className="threadlink"><span className="num-comments">{t('replies', {count: numComments})}</span><span className="arrow-right"/></a>}
				<div className="post">
					<Avatar entity={createdBy} />
					<div className="wrap">
						<div className="meta">
							<DisplayName entity={createdBy} className="name"/>
							<DateTime date={createdOn} relative/>
						</div>
						<div className="message">
							<ModeledContentPanel body={message} widgets={widgets}/>
							{edited && <DateTime date={modifiedOn} format="LLL" prefix="Modified: "/>}
						</div>
						<ActionsComp
							item={item}
							canReply={this.props.asHeadline}
							onEdit={this.onEditClick}
							onDelete={this.onDeleteComment}
							/>
					</div>
				</div>
			</div>
		);

	}

});
