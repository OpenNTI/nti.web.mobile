import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import {Loading} from '@nti/web-commons';
import t from '@nti/lib-locale';

import ShareWith from 'common/components/ShareWith';
import {Editor} from 'modeled-content';


const PUBLISH = {publish: true};

const preventSubmit = e => e.preventDefault() && false;

export default class PostEditor extends React.Component {

	static propTypes = {
		onSubmit: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired,
		title: PropTypes.string,
		value: PropTypes.any,

		error: PropTypes.object,
		busy: PropTypes.bool,

		showSharing: PropTypes.bool
	};

	state = {};

	componentDidMount () {
		const {busy, value, title} = this.props;
		this.setState({ disabled: busy || Editor.isEmpty(value) || Editor.isEmpty(title) });
	}

	componentDidUpdate (prevProps) {
		if(['busy', 'value', 'title'].some(x => this.props[x] !== prevProps[x])) {
			const {busy, value, title} = this.props;
			this.setState({ disabled: busy || Editor.isEmpty(value) || Editor.isEmpty(title) });
		}
	}

	attachEditor = x => this.editor = x
	attachSharing = x => this.sharing = x
	attachTitle = x => this.title = x

	onChange = () => {
		let {busy} = this.props;
		let value = this.editor.getValue();
		let title = (this.title || {}).value;

		this.setState({
			disabled: busy || Editor.isEmpty(value) || Editor.isEmpty(title)
		});
	};

	onCancel = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.props.onCancel(e);
	};

	doSubmit = (e) => {
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
	};

	getSharingSuggestions = () => {
		return Promise.resolve([{
			MimeType: 'application/vnd.nextthought.community',
			publish: true,
			displayName: 'Public',
			displayType: 'Community',
			NTIID: PUBLISH,
			getID: () => PUBLISH
		}]);
	};

	render () {
		let {error, busy, showSharing} = this.props;
		let {disabled} = this.state;


		return (
			<div className="note-editor-frame editor">
				<form onSubmit={preventSubmit}>
					<div className="error-message">
						{error ? t(`common.errorMessages.codes.${error.code}`, error) : null}
					</div>

					{showSharing && (
						<ShareWith ref={this.attachSharing} scope={this} />
					)}

					<div className="title">
						<input type="text"
							ref={this.attachTitle} placeholder="Title"
							className={cx({'error': error && error.field === 'title'})}
							onChange={this.onChange}
							defaultValue={this.props.title} />
					</div>

					<Editor ref={this.attachEditor}
						allowInsertVideo
						className={cx({'error': error && error.field === 'body'})}
						onChange={this.onChange}
						onBlur={this.onChange}
						initialValue={this.props.value}>
						<button onClick={this.onCancel} className={'cancel'}>{t('common.buttons.cancel')}</button>
						<button onClick={this.doSubmit} className={cx('save', {disabled})}>{busy ? (<Loading.Ellipse/>) : t('common.buttons.save')}</button>
					</Editor>
				</form>
			</div>
		);
	}
}
