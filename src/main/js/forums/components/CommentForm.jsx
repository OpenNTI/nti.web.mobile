/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Editor = require('modeled-content').Editor;
var PanelButton = require('common/components/PanelButton');

var CommentForm = React.createClass({

	getValue() {
		return this.refs.editor.getValue();
	},

	_onSubmit(event) {
		var val = this.getValue();
		this.props.onSubmit(event, val);
	},

	render: function() {
		return (
			<PanelButton linkText='Submit' buttonClick={this._onSubmit}>
				<Editor ref='editor'/>
			</PanelButton>
		);
	}

});

module.exports = CommentForm;
