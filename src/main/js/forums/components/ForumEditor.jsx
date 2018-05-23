import React from 'react';
import PropTypes from 'prop-types';
import { OkCancelButtons, PanelButton } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const DEFAULT_TEXT = {
	save: 'Create',
	titlePlaceholder: 'Title'
};

const t = scoped('forums.forum.editor', DEFAULT_TEXT);

function isValid (forumValue) {
	return forumValue.title.trim().length > 0;
}

export default class ForumEditor extends React.Component {
	static propTypes = {
		onSubmit: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired
	}

	state = {
		title: '',
		canSubmit: false
	}

	onChange = ({ target: { name, value }}) => {
		this.setState({ [name]: value, canSubmit: isValid(this.state) });
	}

	onSubmit = () => {
		const { title } = this.state;
		this.props.onSubmit({ title });
	}

	render () {
		const { title, canSubmit } = this.state;
		const { onCancel } = this.props;
		const buttons = (
			<OkCancelButtons
				onOk={this.onSubmit}
				onCancel={onCancel}
				okEnabled={canSubmit}
				okText={t('save')}
			/>
		);

		return (
			<PanelButton className="forum-form" button={buttons}>
				<input
					name="title"
					value={title}
					placeholder={t('titlePlaceholder')}
					onChange={this.onChange}
					required
				/>
			</PanelButton>
		);
	}
}
