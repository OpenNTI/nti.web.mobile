/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('FORUMS');
var CommentForm = require('./CommentForm');
var Loading = require('common/components/LoadingInline');
var Store = require('../Store');
var Constants = require('../Constants');
var Actions = require('../Actions');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var CommentLinks = React.createClass({


	getInitialState: function() {
		return {
			showForm: false,
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

	_addComment: function(event, value) {
		event.preventDefault();
		event.stopPropagation();
		console.debug(value);
		this.setState({
			busy: true
		});
		Actions.addComment(this.props.topic, this.props.parent, value);
	},

	_dismiss: function() {
		this.setState({
					showForm: false
				});
	},

	_toggleCommentForm: function() {
		this.setState({
			showForm: !this.state.showForm
		});
	},

	render: function() {


		var Form = (this.state.busy ? 
					<Loading /> :
					<CommentForm key="commentForm" ref='commentForm' onSubmit={this._addComment} onCancel={this._dismiss}/>);

		return (
			<div>
				<ul>
					<li><a onClick={this._toggleCommentForm}>{this.props.linkText||t('addComment')}</a></li>
				</ul>
				<ReactCSSTransitionGroup transitionName="forum-comments">
					{this.state.showForm && Form}
				</ReactCSSTransitionGroup>
			</div>
		);
	}

});

module.exports = CommentLinks;
