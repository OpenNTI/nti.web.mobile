import React from 'react';

import {isFlag} from 'common/utils';
import {scoped} from 'common/locale';

import ReportLink from './ReportLink';
import ScrollLink from './ScrollLink';

import {COMMENT_FORM_ID} from '../Constants';

const t = scoped('FORUMS');
const gs = x => `actionlink.handlers.${x}`;

export const ActionLinkConstants = {
	REPLIES: gs('REPLIES'),
	REPLY: gs('REPLY'),
	EDIT: gs('EDIT'),
	DELETE: gs('DELETE')
};

export default React.createClass({
	displayName: 'ActionLinks',

	statics: ActionLinkConstants,

	propTypes: {
		item: React.PropTypes.object,
		canReply: React.PropTypes.bool,
		clickHandlers: React.PropTypes.object,
		cssClasses: React.PropTypes.object,
		numComments: React.PropTypes.number
	},


	handleClick (event) {
		console.debug(event);
	},


	getDefaultProps () {
		return {
			cssClasses: {
				replies: []
			},
			clickHandlers: {}
		};
	},

	render () {
		let {item, canReply, clickHandlers, cssClasses, numComments} = this.props;

		let canEdit = isFlag('canEditForumPost') && item.hasLink('edit');
		let canDelete = item.hasLink('edit');
		let canReport = item.hasLink('flag') || item.hasLink('flag.metoo');

		canReply = !item.Deleted && canReply;

		let repliesClasses = numComments > 0 ? ['disclosure-triangle'] : [];

		repliesClasses.push.apply(repliesClasses, cssClasses.replies);

		return (
			<ul key="control-links" className="action-links">
				{canReply &&
					<li key="reply-link">
						<ScrollLink componentId={COMMENT_FORM_ID}>{t('addComment')}</ScrollLink>
					</li>
				}
				{canEdit &&
					<li key="edit-link">
						<a onClick={clickHandlers[ActionLinkConstants.EDIT]}>{t('editComment')}</a>
					</li>}
				{canDelete &&
					<li key="delete-link">
						<a onClick={clickHandlers[ActionLinkConstants.DELETE]}>{t('deleteComment')}</a>
					</li>}
				{canReport &&
					<li key="report-link">
						<ReportLink item={item} />
					</li>}
			</ul>
		);
	}

});
