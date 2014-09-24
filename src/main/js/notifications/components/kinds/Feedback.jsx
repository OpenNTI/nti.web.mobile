/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var NoteableMixin = require('../mixins/Noteable');
var Avatar = require('../../../common/components/Avatar');
var DisplayName = require('../../../common/components/DisplayName');
var DisplayDate = require('../../../common/components/DisplayDate');
var dataserver = require('../../../common/Utils').getServer;

module.exports = React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteable_type: 'assessment.userscourseassignmenthistoryitemfeedback'
	},

	render: function() {

		//TODO get this from the item
		var assignmentName = "<assignmentName>";
		return (
			<li className="notification-item">
				<Avatar username={this.state.username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName username={this.state.username}/>
						{' posted feedback on ' + assignmentName}
					<DisplayDate format="default" created={this.getCreatedTime()}/>
				</div>
			</li>
		);
	}
});
