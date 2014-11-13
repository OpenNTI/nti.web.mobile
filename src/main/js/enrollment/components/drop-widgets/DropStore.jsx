/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Notice = require('common/components/Notice');
var Button = require('common/components/forms/Button');

var DropStore = React.createClass({

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

module.exports = DropStore;
