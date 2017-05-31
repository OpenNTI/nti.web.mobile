import PropTypes from 'prop-types';
import React from 'react';

import PostEditor from 'activity/components/PostEditor';

import {Error as Err} from 'nti-web-commons';

import {Editor} from 'modeled-content';


export default class extends React.Component {
    static displayName = 'WriteSomething';

    static propTypes = {
		entity: PropTypes.object.isRequired,
		store: PropTypes.shape({
			postToActivity: PropTypes.func
		}).isRequired
	};

    state = {
        edit: false
    };

    showEditor = () => {
		this.setState({
			edit: true
		});
	};

    hideEditor = () => {
		this.setState({
			error: void 0,
			edit: false
		});
	};

    onCancel = () => {
		this.hideEditor();
	};

    onSubmit = (title, value, shareWith) => {

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
	};

    render() {
		const {state: {busy, error}, props: {entity}} = this;

		if (error && error.statusCode !== 422) {
			return <Err error={error} />;
		}

		return (
			<div className="write-something">
				{this.state.edit ? (
					<PostEditor
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
}
