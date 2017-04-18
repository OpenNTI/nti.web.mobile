import React from 'react';

import {scoped} from 'nti-lib-locale';

import {StoreEventsMixin} from 'nti-lib-store';
import {Report} from 'nti-web-commons';

import {COMMENT_FORM_ID, EDIT_STARTED, EDIT_ENDED} from '../Constants';
import Store from '../Store';
import ScrollLink from './ScrollLink';


const t = scoped('FORUMS');

export default React.createClass({
	displayName: 'Actions',

	propTypes: {
		item: React.PropTypes.object,
		canReply: React.PropTypes.bool,
		cssClasses: React.PropTypes.object,
		numComments: React.PropTypes.number,

		onDelete: React.PropTypes.func,
		onEdit: React.PropTypes.func
	},

	mixins: [StoreEventsMixin],

	backingStore: Store,
	backingStoreEventHandlers: {
		[EDIT_STARTED]: 'onEditStarted',
		[EDIT_ENDED]: 'onEditEnded'
	},

	getInitialState () {
		return {
			editEnabled: true
		};
	},

	onEditStarted () {
		this.setState({
			editEnabled: false
		});
	},

	onEditEnded () {
		this.setState({
			editEnabled: true
		});
	},

	render () {
		const {props: {item, canReply, onEdit, onDelete}} = this;
		const {editEnabled} = this.state;

		const canEdit = editEnabled && item.isModifiable;
		const canDelete = item.isModifiable;
		const canReport = item.hasLink('flag') || item.hasLink('flag.metoo');

		if (item.Deleted) {
			return null;
		}

		return (
			<ul key="control-links" className="action-links">
				{canReply &&
					<li key="reply-link">
						<ScrollLink componentId={COMMENT_FORM_ID}>{t('entryPlaceholder')}</ScrollLink>
					</li>
				}
				{canEdit && onEdit &&
					<li key="edit-link">
						<a onClick={onEdit}>{t('editComment')}</a>
					</li>}
				{canDelete && onDelete &&
					<li key="delete-link">
						<a onClick={onDelete}>{t('deleteComment')}</a>
					</li>}
				{canReport &&
					<li key="report-link">
						<Report item={item} />
					</li>}
			</ul>
		);
	}

});
