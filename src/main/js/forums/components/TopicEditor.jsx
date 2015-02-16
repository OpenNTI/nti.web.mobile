'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var OkCancelButtons = require('common/components/OkCancelButtons');
var Editor = require('modeled-content').Editor;
var t = require('common/locale').scoped('FORUMS');

function isValid(topicValue) {
	return topicValue.title.trim().length > 0 && (topicValue.body||[]).length > 0;
}


var TopicEditor = React.createClass({

	propTypes: {
		item: React.PropTypes.object,
		onSubmit: React.PropTypes.func.isRequired,
		onCancel: React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		return {
			canSubmit: false
		};
	},

	componentDidMount: function() {
		this.refs.title.getDOMNode().focus();
	},

	getValue() {
		return {
			title: this.refs.title.getDOMNode().value,
			body: this.refs.editor.getValue()
		};
	},

	_onChange() {
		this.setState({
			canSubmit: isValid(this.getValue())
		});
	},

	render: function() {
		var {title, body} = this.props.item||{};
		var buttons = <OkCancelButtons onOk={this.props.onSubmit} onCancel={this.props.onCancel} okEnabled={this.state.canSubmit} />;
		return (
			<PanelButton className="comment-form" button={buttons}>
				<div><input ref='title' defaultValue={title} placeholder={t('topicTitlePlaceholder')} onChange={this._onChange} /></div>
				<div><Editor ref='editor' value={body} onChange={this._onChange} /></div>
			</PanelButton>
		);
	}

});

module.exports = TopicEditor;
