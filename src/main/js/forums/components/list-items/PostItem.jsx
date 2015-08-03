import React from 'react';
import classnames from 'classnames';
import {mimeTypes, GOT_COMMENT_REPLIES, POST} from '../../Constants';
import * as Actions from '../../Actions';
import Store from '../../Store';

import Avatar from 'common/components/Avatar';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import {Panel as ModeledContentPanel} from 'modeled-content';

import Loading from 'common/components/TinyLoader';
import CommentForm from '../CommentForm';
import ActionLinks from '../ActionLinks';

import {areYouSure} from 'prompts';

import NavigatableMixin from 'common/mixins/NavigatableMixin';
import Mixin from './Mixin';
import StoreEvents from 'common/mixins/StoreEvents';
import KeepItemInState from '../../mixins/KeepItemInState';
import ToggleState from '../../mixins/ToggleState';
import LuckyCharms from 'common/components/LuckyCharms';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

let {EDIT, DELETE} = ActionLinks;
const t = require('common/locale').scoped('FORUMS');
const SHOW_REPLIES = 'showReplies';

const gotCommentReplies = 'PostItem:gotCommentRepliesHandler';

export default React.createClass({
	displayName: 'list-items:PostItem',

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

	getActionClickHandlers () {
		return {
			[EDIT]: this.onEditClick,
			[DELETE]: this.onDeleteComment
		};
	},

	commentCompletion (event) {
		this.setState({
			[SHOW_REPLIES]: true
		});
		this.hideForm(event);
	},

	onHideEditForm () {
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

		let linksClasses = {
			replies: []
		};

		let links = (
			<ActionLinks
				key='actionlinks'
				item={item}
				numComments={numComments}
				canReply={this.props.asHeadline}
				cssClasses={linksClasses}
				clickHandlers={this.getActionClickHandlers()} />
		);

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
							<DateTime date={createdOn} relative={true}/>
						</div>
						<div className="message">
							<ModeledContentPanel body={message} />
							{edited && <DateTime date={modifiedOn} format="LLL" prefix="Modified: "/>}
						</div>
						{links}
					</div>
				</div>
			</div>
		);

	}

});
