import React from 'react';
import PropTypes from 'prop-types';
import { OkCancelButtons, PanelButton } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import { Editor } from 'modeled-content';

const DEFAULT_TEXT = {
	save: 'Save',
	titlePlaceholder: 'Title',
};

const t = scoped('forums.topic.editor', DEFAULT_TEXT);

function isValid(topicValue) {
	return (
		topicValue.title.trim().length > 0 && !Editor.isEmpty(topicValue.body)
	);
}

export default class TopicEditor extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		onSubmit: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired,
	};

	state = {
		canSubmit: false,
	};

	attachEditorRef = c => (this.editor = c);
	attachTitleRef = el => (this.title = el);

	componentDidMount() {
		this.title.focus();
	}

	getValue = () => {
		return {
			title: this.title.value,
			body: this.editor.getValue(),
		};
	};

	onEditorChange = () => {
		this.setState({
			canSubmit: isValid(this.getValue()),
		});
	};

	render() {
		const { title, body } = this.props.item || {};
		const buttons = (
			<OkCancelButtons
				onOk={this.props.onSubmit}
				onCancel={this.props.onCancel}
				okEnabled={this.state.canSubmit}
				okText={t('save')}
			/>
		);
		return (
			<PanelButton className="comment-form" button={buttons}>
				<div>
					<input
						ref={this.attachTitleRef}
						defaultValue={title}
						placeholder={t('titlePlaceholder')}
						onChange={this.onEditorChange}
					/>
				</div>
				<div>
					<Editor
						ref={this.attachEditorRef}
						initialValue={body}
						onChange={this.onEditorChange}
						allowInsertVideo
					/>
				</div>
			</PanelButton>
		);
	}
}
