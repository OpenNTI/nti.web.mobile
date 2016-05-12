import React from 'react';
import cx from 'classnames';

import ShareWith from 'common/components/ShareWith';
import Busy from 'common/components/TinyLoader';

import {Editor} from 'modeled-content';

import t from 'common/locale';

const PUBLISH = {publish: true};

const preventSubmit = e => e.preventDefault() && false;

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
		return {};
	},

	componentWillMount () {
		const {busy, value, title} = this.props;
		this.setState({ disabled: busy || Editor.isEmpty(value) || Editor.isEmpty(title) });
	},


	componentWillReceiveProps (nextProps) {
		if(['busy', 'value', 'title'].some(x => this.props[x] !== nextProps[x])) {
			const {busy, value, title} = nextProps;
			this.setState({ disabled: busy || Editor.isEmpty(value) || Editor.isEmpty(title) });
		}
	},


	onChange () {
		let {busy} = this.props;
		let value = this.editor.getValue();
		let title = (this.title || {}).value;

		this.setState({
			disabled: busy || Editor.isEmpty(value) || Editor.isEmpty(title)
		});
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

		const {props: {onSubmit}, title, editor, sharing} = this;
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
		let {disabled} = this.state;


		return (
			<div className="note-editor-frame editor">
				<form onSubmit={preventSubmit}>
				<div className="error-message">
					{error ? t(`ERROR_MESSAGES.CODES.${error.code}`, error) : null}
				</div>

				{showSharing && (
					<ShareWith ref={x => this.sharing = x} scope={this} />
				)}

				<div className="title">
					<input type="text"
						ref={x => this.title = x} placeholder="Title"
						className={cx({'error': error && error.field === 'title'})}
						onChange={this.onChange}
						defaultValue={this.props.title} />
				</div>

				<Editor ref={x => this.editor = x}
					allowInsertVideo
					className={cx({'error': error && error.field === 'body'})}
					onChange={this.onChange}
					onBlur={this.onChange}
					initialValue={this.props.value}>
					<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
					<button onClick={this.doSubmit} className={cx('save', {disabled})}>{busy ? (<Busy/>) : t('BUTTONS.save')}</button>
				</Editor>
				</form>
			</div>
		);
	}
});
