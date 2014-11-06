/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Button = require('common/components/forms/Button');

var DropCourseDialog = React.createClass({

	_cancelClicked: function() {
		console.debug('dialog button clicked.');
	},

	_confirmClicked: function() {
		console.debug('dialog button clicked.');
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