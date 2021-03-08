import React from 'react';
import PropTypes from 'prop-types';

import { Error as Err } from '@nti/web-commons';
import { Forums } from '@nti/web-discussions';
import PostEditor from 'internal/activity/components/PostEditor';
import { Editor } from 'internal/modeled-content';

export default class extends React.Component {
	static displayName = 'WriteSomething';

	static propTypes = {
		entity: PropTypes.object.isRequired,
		store: PropTypes.shape({
			emailNoticiation: PropTypes.bool,
			postToActivity: PropTypes.func,
		}).isRequired,
	};

	state = {
		edit: false,
	};

	showEditor = () => {
		this.setState({
			edit: true,
		});
	};

	hideEditor = () => {
		this.setState({
			error: void 0,
			edit: false,
		});
	};

	onCancel = () => {
		this.hideEditor();
	};

	onSubmit = (title, value, shareWith) => {
		if (Editor.isEmpty(value) || Editor.isEmpty(title)) {
			return;
		}
		let { store } = this.props;
		this.setState({
			busy: true,
		});
		store
			.postToActivity(value, title, shareWith)
			.then(() =>
				this.setState({ edit: false, busy: false, error: false })
			)
			.catch(error => {
				this.setState({ error, busy: false });
			});
	};

	render() {
		const {
			state: { busy, error },
			props: { entity, store },
		} = this;

		if (error && error.statusCode !== 422) {
			return <Err error={error} />;
		}

		const message =
			store && store.emailNoticiation ? (
				<Forums.EmailNotificationBar />
			) : null;

		return (
			<div className="write-something">
				{this.state.edit ? (
					<PostEditor
						showSharing={!!entity.isUser}
						onSubmit={this.onSubmit}
						onCancel={this.onCancel}
						warning={message}
						error={error}
						busy={busy}
					/>
				) : (
					<label onClick={this.showEditor}>Write something</label>
				)}
			</div>
		);
	}
}
