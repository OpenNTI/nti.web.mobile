/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var NoteableMixin = require('../mixins/Noteable');
var DateTime = require('common/components/DateTime');

module.exports = React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'grade'
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
					<DateTime date={this.getEventTime()} />
				</div>
			</li>
		);
	}
});
