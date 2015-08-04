import React from 'react';

import Err from 'common/components/Error';

import Editor from 'modeled-content/components/Editor';

import PostEditor from './PostEditor';

export default React.createClass({
	displayName: 'WriteSomething',

	propTypes: {
		store: React.PropTypes.shape({
			postToActivity: React.PropTypes.func
		}).isRequired
	},

	getInitialState () {
		return {
			edit: false
		};
	},

	showEditor () {
		this.setState({
			edit: true
		});
	},

	hideEditor () {
		this.setState({
			error: void 0,
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
			.then(() => this.setState({ edit: false, busy: false, error: false }))
			.catch(error => {
				this.setState({ error, busy: false });
			});
	},

	render () {

		let {busy, error} = this.state;

		if (error && error.statusCode !== 422) {
			return <Err error={error} />;
		}

		return (
			<div className="write-something">
				{this.state.edit ? (
					<PostEditor ref='postEditor' onSubmit={this.onSubmit} onCancel={this.onCancel} error={error} busy={busy}/>
				) : (
					<label onClick={this.showEditor}>Write something</label>
				)}
			</div>
		);
	}

});
