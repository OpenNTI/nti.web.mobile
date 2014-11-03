/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var NoteableMixin = require('../mixins/Noteable');
var Avatar = require('common/components/Avatar');
var DisplayName = require('common/components/DisplayName');
var DateTime = require('common/components/DateTime');

module.exports = React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'note'
	},


	componentDidMount: function () {
		this.updatePreview(this.props);
	},


	componentWillReceiveProps: function(props) {
		this.updatePreview(props);
	},


	updatePreview: function (props) {
		var change = props.item;
		var note = change.Item || change;
		var title = note.title;
		var body = note.body || [];
		var node;

		if (title) {
			this.setState({preview: title});
			return;
		}

		try {
			node = document.createElement('div');
			body = body.map(function(p) {
				return typeof p === 'object' ? '[attachment]' : p;
			}).join(' ');

			node.innerHTML = body;

			this.setState({preview: node.textContent});
		} catch (e) {
			console.error(e.stack);
		}
	},


	render: function() {

		return (
			<li className="notification-item">
				<Avatar username={this.state.username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName username={this.state.username}/>
						{' shared a note: ' + this.state.preview}
					<DateTime date={this.getCreatedTime()} />
				</div>
			</li>

		);
	}
});
