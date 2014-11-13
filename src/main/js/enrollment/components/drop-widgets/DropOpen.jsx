/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Actions = require('../../Actions');
var Notice = require('common/components/Notice');
var Button = require('common/components/forms/Button');

var DropOpen = React.createClass({

	_cancelClicked: function() {
		history.back();
	},

	_confirmClicked: function() {
		this.setState({
			loading: true
		});
		Actions.dropCourse(this.props.courseId);
	},

	render: function() {
		return (
			<div>
				<Notice>Drop {this.props.courseTitle}?</Notice>
				<div className="small-12 columns">
					<Button onClick={this._cancelClicked} className="small-5 columns">Cancel</Button>
					<Button onClick={this._confirmClicked} className="small-5 columns">Drop course</Button>
				</div>
			</div>
		);
	}

});

module.exports = DropOpen;
