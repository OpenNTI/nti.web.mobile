/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var OkCancelButtons = require('common/components/OkCancelButtons');
var Editor = require('modeled-content').Editor;
var t = require('common/locale').scoped('FORUMS');

var TopicEditor = React.createClass({

	propTypes: {
		item: React.PropTypes.object,
		onSubmit: React.PropTypes.func.isRequired,
		onCancel: React.PropTypes.func.isRequired
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
		var {title, body} = this.props.item||{};
		var buttons = <OkCancelButtons onOk={this.props.onSubmit} onCancel={this.props.onCancel} />;
		return (
			<PanelButton className="comment-form" button={buttons}>
				<div><input ref='title' defaultValue={title} placeholder={t('topicTitlePlaceholder')}/></div>
				<div><Editor ref='editor' value={body} /></div>
			</PanelButton>
		);
	}

});

module.exports = TopicEditor;
