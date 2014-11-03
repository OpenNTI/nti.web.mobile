/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var NoteableMixin = require('../mixins/Noteable');
var Avatar = require('common/components/Avatar');
var DisplayName = require('common/components/DisplayName');
var DateTime = require('common/components/DateTime');

module.exports = React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'assessment.userscourseassignmenthistoryitemfeedback'
	},

	render: function() {
		var item = this.props.item;
		var assignmentName = item.AssignmentName || 'an assignment';
		return (
			<li className="notification-item">
				<Avatar username={this.state.username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName username={this.state.username}/>
						{' posted feedback on ' + assignmentName}
					<DateTime date={this.getCreatedTime()} />
				</div>
			</li>
		);
	}
});
