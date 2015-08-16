import React from 'react';
import cx from 'classnames';

import Busy from 'common/components/TinyLoader';

import {Editor} from 'modeled-content';

import t from 'common/locale';

export default React.createClass({
	displayName: 'PostEditor',

	propTypes: {
		onSubmit: React.PropTypes.func.isRequired,
		onCancel: React.PropTypes.func.isRequired,
		title: React.PropTypes.string,
		value: React.PropTypes.any,

		error: React.PropTypes.object,
		busy: React.PropTypes.bool
	},

	getInitialState () {
		return {
		};
	},

	componentWillMount () {
		this.setState({
			title: this.props.title,
			value: this.props.value
		});
	},

	onTitleChange (event) {
		this.setState({
			title: event.target.value
		});
	},

	onChange () {
		let value = this.refs.editor.getValue();
		this.setState({value});
	},

	doSubmit () {
		let {onSubmit} = this.props;
		let {title, value} = this.state;
		title = this.refs.title.getDOMNode().value;
		value = this.refs.editor.getValue();
		if (typeof onSubmit === 'function') {
			onSubmit(title, value);
		}
	},

	render () {
		let {error, busy} = this.props;
		let {value, title} = this.state;
		let disabled = busy || Editor.isEmpty(value) || Editor.isEmpty(title);

		return (
			<div className="editor">
				<div className="error-message">
					{error ? t(`ERROR_MESSAGES.CODES.${error.code}`, error) : null}
				</div>
				<input type="text"
					ref="title"
					className={cx({'error': error && error.field === 'title'})}
					onChange={this.onTitleChange}
					defaultValue={this.props.title} />

				<Editor ref="editor"
					className={cx({'error': error && error.field === 'body'})}
					onChange={this.onChange}
					onBlur={this.onChange}
					value={this.props.value}>
					<button onClick={this.props.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
					<button onClick={this.doSubmit} className={cx('save', {disabled})}>{busy ? (<Busy/>) : t('BUTTONS.save')}</button>
				</Editor>
			</div>
		);
	}
});
