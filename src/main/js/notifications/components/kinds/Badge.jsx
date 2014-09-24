/** @jsx React.DOM */
//TODO
'use strict';

var React = require('react/addons');
var NoteableMixin = require('../mixins/Noteable');
var Avatar = require('../../../common/components/Avatar');
var DisplayName = require('../../../common/components/DisplayName');
var DisplayDate = require('../../../common/components/DisplayDate');

module.exports = React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		handles: function(item) {
			if(item.MimeType.replace('application/vnd.nextthought.', '') == 'forums.generalforumcomment'){
				return true;
			}
			return false;
		}
	},

	render: function() {
		var thestring = " commented on a discussion.";
		return (
			<li className="notification-item">
				<Avatar username={this.state.username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName username={this.state.username}/>
						{thestring}
					<DisplayDate format="default" />
				</div>
			</li>
		);
	}
});
