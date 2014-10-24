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
		noteable_type: 'grade'
	},

	render: function() {
		var item = this.props.item.Item;
		var courseName = item.CourseName;
		var assignmentName = item.AssignmentName || 'an assignment';
		return (
			<li className="notification-item">
				<div className='grade'/>
				<div className="wrap">
					Grade recieved for {assignmentName} in {courseName}
					<DateTime date={this.getCreatedTime()} />
				</div>
			</li>
		);
	}
});
