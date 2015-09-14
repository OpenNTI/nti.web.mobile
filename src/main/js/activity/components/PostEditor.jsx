import React from 'react';
import cx from 'classnames';

import ShareWith from 'common/components/ShareWith';
import Busy from 'common/components/TinyLoader';

import {Editor} from 'modeled-content';

import t from 'common/locale';

const PUBLISH = {publish: true};

export default React.createClass({
	displayName: 'PostEditor',

	propTypes: {
		onSubmit: React.PropTypes.func.isRequired,
		onCancel: React.PropTypes.func.isRequired,
		title: React.PropTypes.string,
		value: React.PropTypes.any,

		error: React.PropTypes.object,
		busy: React.PropTypes.bool,

		showSharing: React.PropTypes.bool
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

	onCancel (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.props.onCancel(e);
	},


	doSubmit (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		const {props: {onSubmit}, refs: {title, editor, sharing}} = this;
		let {value: titleValue} = title;
		let body = editor.getValue();

		let shareWith = sharing && sharing.getValue(o => o.NTIID);


		if (typeof onSubmit === 'function') {
			onSubmit(titleValue, body, shareWith);
		}
	},


	getSharingSuggestions () {
		return Promise.resolve([{
			MimeType: 'application/vnd.nextthought.community',
			publish: true,
			displayName: 'Public',
			displayType: 'Community',
			NTIID: PUBLISH,
			getID: () => PUBLISH
		}]);
	},


	render () {
		let {error, busy, showSharing} = this.props;
		let {value, title} = this.state;
		let disabled = busy || Editor.isEmpty(value) || Editor.isEmpty(title);

		return (
			<div className="note-editor-frame editor">
				<form onSubmit={x => x.preventDefault() && false}>
				<div className="error-message">
					{error ? t(`ERROR_MESSAGES.CODES.${error.code}`, error) : null}
				</div>

				{showSharing && (
					<ShareWith ref="sharing" scope={this} />
				)}

				<div className="title">
					<input type="text"
						ref="title" placeholder="Title"
						className={cx({'error': error && error.field === 'title'})}
						onChange={this.onTitleChange}
						defaultValue={this.props.title} />
				</div>

				<Editor ref="editor"
					className={cx({'error': error && error.field === 'body'})}
					onChange={this.onChange}
					onBlur={this.onChange}
					value={this.props.value}>
					<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
					<button onClick={this.doSubmit} className={cx('save', {disabled})}>{busy ? (<Busy/>) : t('BUTTONS.save')}</button>
				</Editor>
				</form>
			</div>
		);
	}
});
