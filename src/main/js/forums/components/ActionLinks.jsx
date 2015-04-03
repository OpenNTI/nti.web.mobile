'use strict';

var React = require('react');

var t = require('common/locale').scoped('FORUMS');
var ReportLink = require('./ReportLink');
var nsKeyMirror = require('nti.lib.interfaces/utils/namespaced-key-mirror');
var {isFlag} = require('common/utils');

import ScrollLink from './ScrollLink';
import {COMMENT_FORM_ID} from '../Constants';

var ActionLinks = React.createClass({

	statics: nsKeyMirror('actionlink.handlers', {
		REPLIES: null,
		REPLY: null,
		EDIT: null,
		DELETE: null
	}),

	_handleClick(event) {
		console.debug(event);
	},

	getDefaultProps: function() {
		return {
			cssClasses: {
				replies:[]
			},
			clickHandlers: {}
		};
	},

	render: function() {

		var {item} = this.props;
		var canEdit =  isFlag('canEditForumPost') && item.hasLink('edit');
		var canDelete =  item.hasLink('edit');
		var canReport = item.hasLink('flag')||item.hasLink('flag.metoo');
		var canReply = !item.Deleted && this.props.canReply;

		var {numComments} = this.props;

		var repliesClasses = numComments > 0 ? ['disclosure-triangle'] : [];
		repliesClasses.push.apply(repliesClasses, this.props.cssClasses.replies);
		var {clickHandlers} = this.props;

		return (
			<ul key="control-links" className="action-links">
				{canReply &&
					<li key="reply-link">
						<ScrollLink componentId={COMMENT_FORM_ID}>{t('addComment')}</ScrollLink>
					</li>
				}
				{canEdit &&
					<li key="edit-link">
						<a onClick={clickHandlers[ActionLinks.EDIT]}>{t('editComment')}</a>
					</li>}
				{canDelete &&
					<li key="delete-link">
						<a onClick={clickHandlers[ActionLinks.DELETE]}>{t('deleteComment')}</a>
					</li>}
				{canReport &&
					<li key="report-link">
						<ReportLink item={item} />
					</li>}
			</ul>
		);
	}

});

module.exports = ActionLinks;
