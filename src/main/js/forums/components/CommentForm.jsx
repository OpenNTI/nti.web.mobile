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
			complete: false
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
					complete: true
				});
				if (this.props.onCompletion) {
					this.props.onCompletion(event);
				}
				break;
		}
	},

	_addComment: function(event) {
		event.preventDefault();
		event.stopPropagation();
		this.setState({
			busy: true
		});
		Actions.addComment(this.props.topic, this.props.parent, this.getValue());
	},

	render: function() {

		if (this.state.busy) {
			return <Loading />;
		}

		if (this.state.complete) {
			return <Notice>Comment added</Notice>;
		}

		var buttons = <OkCancelButtons onOk={this._addComment} onCancel={this.props.onCancel} />;

		return (
			<PanelButton className="comment-form" linkText='Submit' button={buttons}>
				<Editor ref='editor'/>
			</PanelButton>
		);
	}

});

module.exports = CommentForm;
