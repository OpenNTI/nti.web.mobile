import React from 'react/addons';
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
			body = body.map(p => typeof p === 'object' ? '[attachment]' : p).join(' ');

			node.innerHTML = body;

			this.setState({preview: node.textContent});
		} catch (e) {
			console.error(e.stack);
		}
	},


	render () {

		return (
			<li className="notification-item">
				<Avatar username={this.state.username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName username={this.state.username}/>
						{' shared a note: ' + this.state.preview}
					<DateTime date={this.getEventTime()} />
				</div>
			</li>

		);
	}
});
