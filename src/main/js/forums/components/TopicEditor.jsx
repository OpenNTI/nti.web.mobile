import React from 'react';
import PanelButton from 'common/components/PanelButton';
import OkCancelButtons from 'common/components/OkCancelButtons';
import {Editor} from 'modeled-content';
import {scoped} from 'common/locale';

const t = scoped('FORUMS');

function isValid (topicValue) {
	return topicValue.title.trim().length > 0 && (topicValue.body || []).length > 0;
}


export default React.createClass({
	displayName: 'TopicEditor',

	propTypes: {
		item: React.PropTypes.object,
		onSubmit: React.PropTypes.func.isRequired,
		onCancel: React.PropTypes.func.isRequired
	},

	getInitialState () {
		return {
			canSubmit: false
		};
	},

	componentDidMount () {
		this.title.focus();
	},

	getValue () {
		return {
			title: this.title.value,
			body: this.editor.getValue()
		};
	},

	onEditorChange () {
		this.setState({
			canSubmit: isValid(this.getValue())
		});
	},

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
				<div><input
					ref={el => this.title = el}
					defaultValue={title}
					placeholder={t('topicTitlePlaceholder')}
					onChange={this.onEditorChange} />
				</div>
				<div><Editor
					ref={c => this.editor = c}
					value={body}
					onChange={this.onEditorChange}
					allowInsertVideo/>
				</div>
			</PanelButton>
		);
	}

});
