import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {scoped} from '@nti/lib-locale';
import {StoreEventsMixin} from '@nti/lib-store';
import {Report} from '@nti/web-commons';

import {COMMENT_FORM_ID, EDIT_STARTED, EDIT_ENDED} from '../Constants';
import Store from '../Store';

import ScrollLink from './ScrollLink';


const DEFAULT_TEXT = {
	placeholder: 'Add a Comment',
	edit: 'Edit',
	delete: 'Delete',
};

const t = scoped('forums.comment', DEFAULT_TEXT);

export default createReactClass({
	displayName: 'Actions',

	propTypes: {
		item: PropTypes.object,
		canReply: PropTypes.bool,
		cssClasses: PropTypes.object,
		numComments: PropTypes.number,

		onDelete: PropTypes.func,
		onEdit: PropTypes.func
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
				{canReply && (
					<li key="reply-link">
						<ScrollLink componentId={COMMENT_FORM_ID}>{t('placeholder')}</ScrollLink>
					</li>
				)}
				{canEdit && onEdit && (
					<li key="edit-link">
						<a onClick={onEdit}>{t('edit')}</a>
					</li>
				)}
				{canDelete && onDelete && (
					<li key="delete-link">
						<a onClick={onDelete}>{t('delete')}</a>
					</li>
				)}
				{canReport && (
					<li key="report-link">
						<Report item={item} />
					</li>
				)}
			</ul>
		);
	}

});
