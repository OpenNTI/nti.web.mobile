import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import Logger from '@nti/util-logger';
import { Loading } from '@nti/web-commons';
import t from '@nti/lib-locale';
import { Editor } from 'internal/modeled-content';

const logger = Logger.get('assessment:components:FeedbackEditor');

export default class FeedbackEditor extends React.Component {
	static propTypes = {
		onCancel: PropTypes.func,
		onSubmit: PropTypes.func.isRequired,
		value: PropTypes.array,
	};

	attachRef = x => (this.editor = x);

	state = {};

	componentDidMount() {
		this.updateDisabled(this.props.value || null);
	}

	componentDidUpdate(props) {
		if (props.value !== this.props.value) {
			this.updateDisabled(this.props.value);
		}
	}

	updateDisabled = value => {
		let disabled = Editor.isEmpty(value);
		this.setState({ disabled });
	};

	render() {
		let { disabled, busy } = this.state;

		return (
			<div className={cx('feedback editor', { busy })}>
				<Editor
					ref={this.attachRef}
					initialValue={this.props.value}
					onChange={this.onChange}
					onBlur={this.onChange}
					allowInsertImage={false}
				>
					<button onClick={this.onCancel} className={'cancel'}>
						{t('common.buttons.cancel')}
					</button>
					<button
						onClick={this.onClick}
						className={cx('save', { disabled })}
					>
						{t('common.buttons.save')}
					</button>
				</Editor>

				{busy ? <Loading.Mask message="Saving..." /> : null}
			</div>
		);
	}

	onChange = () => {
		if (this.editor) {
			let value = this.editor.getValue();
			this.updateDisabled(value);
		}
	};

	onCancel = e => {
		e.preventDefault();
		e.stopPropagation();
		this.props.onCancel();
	};

	onClick = e => {
		e.preventDefault();
		e.stopPropagation();

		let value = this.editor.getValue();

		if (Editor.isEmpty(value)) {
			return;
		}

		this.setState({ busy: true });
		let thenable = this.props.onSubmit(value);
		if (!thenable) {
			logger.error(
				'onSubmit callback did not return a thenable, this component will never leave the busy state.'
			);
			return;
		}

		thenable
			.catch(() => {})
			.then(() => {
				this.setState({ busy: false });
			});
	};
}
