/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var OkCancelButtons = require('common/components/OkCancelButtons');
var Editor = require('modeled-content').Editor;

var TopicEditor = React.createClass({

	propTypes: {

	},

	getValue() {
		return {
			title: this.refs.title.getDOMNode().value,
			body: this.refs.editor.getValue()
		};
	},

	componentDidMount: function() {
		this.refs.title.getDOMNode().focus();
	},

	render: function() {
		var buttons = <OkCancelButtons onOk={this.props.onSubmit} onCancel={this.props.onCancel} />;
		return (
			<PanelButton className="comment-form" button={buttons}>
				<div><input ref='title' /></div>
				<div><Editor ref='editor' /></div>
			</PanelButton>
		);
	}

});

module.exports = TopicEditor;
