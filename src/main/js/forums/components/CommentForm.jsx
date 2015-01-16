/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Editor = require('modeled-content').Editor;
var PanelButton = require('common/components/PanelButton');
var OkCancelButtons = require('common/components/OkCancelButtons');
var Actions = require('../Actions');
var Store = require('../Store');
var Constants = require('../Constants');
var Loading = require('common/components/LoadingInline');

var CommentForm = React.createClass({

	propTypes: {
		onCancel: React.PropTypes.func.isRequired,
		topic: React.PropTypes.object.isRequired,
		parent: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			busy: false 
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChange);
	},

	_storeChange: function(event) {
		switch (event.type) {
			case Constants.COMMENT_ADDED:
				// TODO: make sure it's the right comment?
				// the one posted by this instance of the form?
				this.setState({
					busy: false,
					showForm: false
				});
				break;
		}
	},

	getValue() {
		return this.refs.editor.getValue();
	},

	_addComment: function(event, value) {
		this.setState({
			busy: true
		});
		var {topic, parent} = this.props;
		Actions.addComment(topic, parent, value);
	},

	_onSubmit(event) {
		event.preventDefault();
		event.stopPropagation();
		var val = this.getValue();
		this._addComment(event, val);
	},

	_onCancel(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onCancel(event);
	},

	render: function() {

		if (this.state.busy) {
			return <Loading />;
		}

		var buttons = <OkCancelButtons onOk={this._onSubmit} onCancel={this._onCancel} />;

		return (
			<PanelButton className="comment-form" linkText='Submit' button={buttons}>
				<Editor ref='editor'/>
			</PanelButton>
		);
	}

});

module.exports = CommentForm;
