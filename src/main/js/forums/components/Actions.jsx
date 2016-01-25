import React from 'react';

import {scoped} from 'common/locale';

import Report from 'common/components/Report';
import ScrollLink from './ScrollLink';

import {COMMENT_FORM_ID} from '../Constants';

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

	render () {
		const {props: {item, canReply, onEdit, onDelete}} = this;

		const canEdit = item.hasLink('edit');
		const canDelete = item.hasLink('edit');
		const canReport = item.hasLink('flag') || item.hasLink('flag.metoo');

		if (item.Deleted) {
			return null;
		}

		return (
			<ul key="control-links" className="action-links">
				{canReply &&
					<li key="reply-link">
						<ScrollLink componentId={COMMENT_FORM_ID}>{t('addComment')}</ScrollLink>
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
