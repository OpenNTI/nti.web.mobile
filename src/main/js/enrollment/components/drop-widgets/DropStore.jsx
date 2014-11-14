/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');

var DropStore = React.createClass({

	_cancelClicked: function() {
		history.back();
	},

	render: function() {
		return (
			<div className="column">
				<PanelButton linkText="Okay" buttonClick={this._cancelClicked}>
					Please contact support to drop this course.
				</PanelButton>
			</div>
		);
	}

});

module.exports = DropStore;
