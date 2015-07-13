import React from 'react';
import NoteableMixin from '../mixins/Noteable';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'note'
	},


	componentDidMount  () {
		this.updatePreview(this.props);
	},


	componentWillReceiveProps (props) {
		this.updatePreview(props);
	},


	updatePreview  (props) {
		let change = props.item;
		let note = change.Item || change;
		let title = note.title;
		let body = note.body || [];
		let node;

		if (title) {
			this.setState({preview: title});
			return;
		}

		try {
			node = document.createElement('div');
			body = body.map(p => typeof p === 'object' ? '[attachment]' : p).join(' ');

			node.innerHTML = body;

			this.setState({preview: node.textContent});
		} catch (e) {
			console.error(e.stack);
		}
	},


	render () {
		let {url, username, preview} = this.state;
		return (
			<li className="notification-item">
				<Avatar entity={username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName entity={username}/>
						{' shared a note: ' + preview}
					<DateTime date={this.getEventTime()} relative/>
				</div>
			</li>

		);
	}
});
