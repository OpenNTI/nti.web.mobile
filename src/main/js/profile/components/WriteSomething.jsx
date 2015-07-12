import React from 'react';
import Editor from 'modeled-content/components/Editor';
import PostEditor from './PostEditor';
import Loading from 'common/components/TinyLoader';
import Err from 'common/components/Error';

export default React.createClass({
	displayName: 'WriteSomething',

	propTypes: {
		store: React.PropTypes.shape({
			postToActivity: React.PropTypes.func
		}).isRequired
	},

	getInitialState: function() {
		return {
			edit: false
		};
	},

	showEditor() {
		this.setState({
			edit: true
		});
	},

	hideEditor() {
		this.setState({
			edit: false
		});
	},

	onCancel () {
		this.hideEditor();
	},

	onSubmit (title, value) {

		if (Editor.isEmpty(value) || Editor.isEmpty(title)) {
			return;
		}
		let {store} = this.props;
		this.setState({
			busy: true
		});
		store.postToActivity(value, title)
		.then(result => {
			console.log(result);
			this.setState({
				edit: false,
				busy: false,
				error: false
			});
		},
		reason => {
			this.setState({
				busy: false,
				error: reason
			});
		});
	},

	render () {

		let {busy, value, title, error} = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (busy) {
			return <Loading />;
		}

		return (
			<div className="write-something">
				{this.state.edit
					?
					<PostEditor ref='postEditor' onSubmit={this.onSubmit} onCancel={this.onCancel} />
					:
					<label onClick={this.showEditor}>Write something</label>
				}
			</div>
		);
	}

});
