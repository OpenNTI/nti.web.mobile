/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Editor = require('modeled-content').Editor;
var PanelButton = require('common/components/PanelButton');
var Notice = require('common/components/Notice');
var OkCancelButtons = require('common/components/OkCancelButtons');
var Loading = require('common/components/LoadingInline');
var Actions = require('../Actions');
var Store = require('../Store');
var Constants = require('../Constants');

var CommentForm = React.createClass({

	getInitialState: function() {
		return {
			busy: false,
			complete: false,
			canSubmit: false,
			error: null
		};
	},

	getValue() {
		return this.refs.editor.getValue();
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChanged);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	_storeChanged: function(event) {
		switch (event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.COMMENT_ADDED:
				this.setState({
					busy: false,
					complete: true,
					error: null
				});
				if (this.props.onCompletion) {
					this.props.onCompletion(event);
				}
				break;
			case Constants.COMMENT_ERROR:
				this.setState({
					error: event.data.reason,
					busy: false
				});
				break;
		}
	},

	_addComment: function(event) {
		event.preventDefault();
		event.stopPropagation();
		var val = this.getValue();
		if (!val || val.length === 0) {
			return;
		}
		this.setState({
			busy: true
		});
		Actions.addComment(this.props.topic, this.props.parent, val);
	},

	_bodyChange(oldValue, newValue) {
		this.setState({
			canSubmit: (newValue && newValue.length > 0)
		});
	},

	render: function() {

		if (this.state.busy) {
			return <Loading />;
		}

		if (this.state.complete) {
			return <Notice>Comment added</Notice>;
		}

		var buttons = <OkCancelButtons onOk={this._addComment} okEnabled={this.state.canSubmit} onCancel={this.props.onCancel} />;

		return (
			<PanelButton className="comment-form" linkText='Submit' button={buttons}>
				{this.state.error && <Notice class="err">{this.state.error.message||'An error occurred.'}</Notice>}
				<Editor ref='editor' onChange={this._bodyChange} />
			</PanelButton>
		);
	}

});

module.exports = CommentForm;
