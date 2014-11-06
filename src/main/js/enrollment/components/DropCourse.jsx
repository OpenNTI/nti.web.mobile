/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Button = require('common/components/forms/Button');
var Actions = require('../Actions');

var DropCourseDialog = React.createClass({

	_cancelClicked: function() {
		console.debug('dialog button clicked.');
	},

	_confirmClicked: function() {
		Actions.dropCourse(this.props.courseId);
	},

	render: function() {
		return (
			<div className='confirmation dialog'>
				<p>Are you sure?</p>
				<div className="row">
					<Button onClick={this._cancelClicked} className="small-5 columns">No. Cancel.</Button>
					<Button onClick={this._confirmClicked} className="small-5 columns">Yes. I'm sure</Button>
				</div>
			</div>
		);
	}

});

module.exports = DropCourseDialog;
