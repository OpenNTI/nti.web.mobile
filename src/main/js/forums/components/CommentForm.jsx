'use strict';

var React = require('react/addons');
var Editor = require('modeled-content').Editor;
var PanelButton = require('common/components/PanelButton');
var Notice = require('common/components/Notice');
var OkCancelButtons = require('common/components/OkCancelButtons');
var Loading = require('common/components/LoadingInline');
var Actions = require('../Actions');
var Store = require('../Store');
var {COMMENT_ADDED, COMMENT_SAVED, COMMENT_ERROR} = require('../Constants');

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
			return typeof h === 'string' ? this[h](event) : h.call(this, event);
		}
	},

	_success: function() {
		this.setState({
			busy: false,
			complete: true,
			error: null
		});
		if (this.props.onCompletion) {
			this.props.onCompletion(event);
		}
	},

	_handlers: {
		[COMMENT_ADDED]: '_success',
		[COMMENT_SAVED]: '_success',
		[COMMENT_ERROR]: function(event) {
			this.setState({
				error: event.data.reason,
				busy: false
			});
		}
	},

	_addComment: function() {
		var val = this.getValue();
		if (!val || val.length === 0) {
			return;
		}
		this.setState({
			busy: true
		});
		Actions.addComment(this.props.topic, this.props.parent, val);
	},

	_save: function(item) {
		this.setState({
			busy: true
		});
		Actions.saveComment(item, {
			body: this.getValue()
		});
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

		var savefunc = this.props.editItem ? this._save.bind(this, this.props.editItem) : this._addComment;
		var buttons = <OkCancelButtons onOk={savefunc} okEnabled={this.state.canSubmit} onCancel={this.props.onCancel} />;
		var value = (this.props.editItem||{}).body;

		return (
			<PanelButton className="comment-form" linkText='Submit' button={buttons}>
				{this.state.error && <Notice className="err">{this.state.error.message||'An error occurred.'}</Notice>}
				<Editor ref='editor'
					onChange={this._bodyChange}
					value={value} />
			</PanelButton>
		);
	}

});

module.exports = CommentForm;
