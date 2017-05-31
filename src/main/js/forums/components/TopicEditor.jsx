import PropTypes from 'prop-types';
import React from 'react';
import {OkCancelButtons, PanelButton} from 'nti-web-commons';
import {Editor} from 'modeled-content';
import {scoped} from 'nti-lib-locale';

const t = scoped('FORUMS');

function isValid (topicValue) {
	return topicValue.title.trim().length > 0 && !Editor.isEmpty(topicValue.body);
}


export default class extends React.Component {
	static displayName = 'TopicEditor';

	static propTypes = {
		item: PropTypes.object,
		onSubmit: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired
	};

	state = {
		canSubmit: false
	};

	componentDidMount () {
		this.title.focus();
	}

	getValue = () => {
		return {
			title: this.title.value,
			body: this.editor.getValue()
		};
	};

	onEditorChange = () => {
		this.setState({
			canSubmit: isValid(this.getValue())
		});
	};

	render () {
		const {title, body} = this.props.item || {};
		const buttons = (
			<OkCancelButtons
				onOk={this.props.onSubmit}
				onCancel={this.props.onCancel}
				okEnabled={this.state.canSubmit}
				okText={t('editorOkButton')}
				/>
		);
		return (
			<PanelButton className="comment-form" button={buttons}>
				<div>
					<input
						ref={el => this.title = el}
						defaultValue={title}
						placeholder={t('topicTitlePlaceholder')}
						onChange={this.onEditorChange}
						/>
				</div>
				<div>
					<Editor
						ref={c => this.editor = c}
						initialValue={body}
						onChange={this.onEditorChange}
						allowInsertVideo
						/>
				</div>
			</PanelButton>
		);
	}
}
