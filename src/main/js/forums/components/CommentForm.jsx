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
var {COMMENT_ADDED, COMMENT_ERROR} = require('../Constants');

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
		var h = this._handlers[event.type];
		if (h) {
			h.call(this, event);
		}
	},

	_handlers: {
		[COMMENT_ADDED]: function() {
			this.setState({
				busy: false,
				complete: true,
				error: null
			});
			if (this.props.onCompletion) {
				this.props.onCompletion(event);
			}
		},
		[COMMENT_ERROR]: function(event) {
			this.setState({
				error: event.data.reason,
				busy: false
			});
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
				<Editor ref='editor'
					onChange={this._bodyChange}
					value={this.props.value} />
			</PanelButton>
		);
	}

});

module.exports = CommentForm;
