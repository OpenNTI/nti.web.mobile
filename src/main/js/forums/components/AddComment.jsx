/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('FORUMS');
var CommentForm = require('./CommentForm');

var AddComment = React.createClass({


	getInitialState: function() {
		return {
			showForm: false
		};
	},

	_toggleCommentForm: function(event) {
		event.preventDefault();
		event.stopPropagation();
		this.setState({
			showForm: !this.state.showForm
		});
	},

	_hideForm() {
		console.log('hide form');
		this.setState({
			showForm: false
		});
	},

	render: function() {


		var Form = <CommentForm
						key="commentForm"
						ref='commentForm'
						topic={this.props.topic}
						parent={this.props.parent}
						onCompletion={this._hideForm}
						onCancel={this._hideForm}/>;

		return (
			<div>
				<ul>
					<li><a onClick={this._toggleCommentForm}>{this.props.linkText||t('addComment')}</a></li>
				</ul>
				{this.state.showForm && Form}
			</div>
		);
	}

});

module.exports = AddComment;
