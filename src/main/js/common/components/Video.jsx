/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var url = require('url');
var t = require('../locale');

var UICONF_ID = $AppConfig.kalturaUIID || '15491291';

function _partnerId(src) {
	// kaltura://1500101/0_4ol5o04l/
	// <iframe src="http://www.kaltura.com/p/{PARTNER_ID}/sp/{PARTNER_ID}00/embedIframeJs/uiconf_id/{UICONF_ID}/partner_id/{PARTNER_ID}?iframeembed=true&playerId={UNIQUE_OBJ_ID}&entry_id={ENTRY_ID}" width="400" height="330" allowfullscreen webkitallowfullscreen mozAllowFullScreen frameborder="0"></iframe>
}

module.exports = React.createClass({
	displayName: 'Video',

	componentDidMount: function() {
		
	},

	render: function() {
		var e = this.props.src;
		var parsed = url.parse(e);
		var partnerId = parsed.host;
		var entryId = /\/(.*)\/$/.exec(parsed.path)[1];
		var frameSrc = t('VIDEO.KalturaIFrameUrl', {partnerId: partnerId, entryId: entryId, uiConfId:UICONF_ID});
		return (
			<div className="flex-video">
				<iframe src={frameSrc} width="400" height="330" allowfullscreen webkitallowfullscreen mozAllowFullScreen frameborder="0"></iframe>
			</div>
		);
	}
});
