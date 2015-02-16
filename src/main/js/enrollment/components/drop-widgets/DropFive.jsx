'use strict';

var React = require('react');
var Notice = require('common/components/Notice');
var Button = require('common/forms/components/Button');

var DropFive = React.createClass({

	_cancelClicked: function() {
		history.back();
	},

	render: function() {
		return (
			<div>
				<Notice>To drop {this.props.courseTitle} please contact someone.</Notice>
				<div className="small-12 columns">
					<Button onClick={this._cancelClicked} className="small-5 columns">Okay</Button>
				</div>
			</div>
		);
	}

});

module.exports = DropFive;
