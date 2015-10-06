import React from 'react';

import Err from 'common/components/Error';
import PostEditor from 'common/components/PostEditor';

import {Editor} from 'modeled-content';


export default React.createClass({
	displayName: 'WriteSomething',

	propTypes: {
		entity: React.PropTypes.object.isRequired,
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

	onSubmit (title, value, shareWith) {

		if (Editor.isEmpty(value) || Editor.isEmpty(title)) {
			return;
		}
		let {store} = this.props;
		this.setState({
			busy: true
		});
		store.postToActivity(value, title, shareWith)
			.then(() => this.setState({ edit: false, busy: false, error: false }))
			.catch(error => {
				this.setState({ error, busy: false });
			});
	},

	render () {
		const {state: {busy, error}, props: {entity}} = this;

		if (error && error.statusCode !== 422) {
			return <Err error={error} />;
		}

		return (
			<div className="write-something">
				{this.state.edit ? (
					<PostEditor ref="postEditor"
						showSharing={!!entity.isUser}
						onSubmit={this.onSubmit}
						onCancel={this.onCancel}
						error={error}
						busy={busy}/>
				) : (
					<label onClick={this.showEditor}>Write something</label>
				)}
			</div>
		);
	}

});
