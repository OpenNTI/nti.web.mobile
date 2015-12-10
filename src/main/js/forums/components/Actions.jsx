import React from 'react';

import {isFlag} from 'common/utils';
import {scoped} from 'common/locale';

import ReportLink from './ReportLink';
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


	handleClick (event) {
		console.debug(event);
	},


	getDefaultProps () {
		const def = () => { console.error('No Handler passed'); };
		return {
			onDelete: def,
			onEdit: def
		};
	},

	render () {
		const {props: {item, canReply, onEdit, onDelete}} = this;

		let canEdit = isFlag('canEditForumPost') && item.hasLink('edit');
		let canDelete = item.hasLink('edit');
		let canReport = item.hasLink('flag') || item.hasLink('flag.metoo');

		canReply = !item.Deleted && canReply;

		return (
			<ul key="control-links" className="action-links">
				{canReply &&
					<li key="reply-link">
						<ScrollLink componentId={COMMENT_FORM_ID}>{t('addComment')}</ScrollLink>
					</li>
				}
				{canEdit &&
					<li key="edit-link">
						<a onClick={onEdit}>{t('editComment')}</a>
					</li>}
				{canDelete &&
					<li key="delete-link">
						<a onClick={onDelete}>{t('deleteComment')}</a>
					</li>}
				{canReport &&
					<li key="report-link">
						<ReportLink item={item} />
					</li>}
			</ul>
		);
	}

});
