import './NoteEditor.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Loading, HideNavigation } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import { Editor } from 'modeled-content';
import ShareWith from 'common/components/ShareWith';

const t = scoped('common.buttons');

export default class NoteEditor extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		scope: PropTypes.object,

		onCancel: PropTypes.func,
		onSubmit: PropTypes.func,
		onSave: PropTypes.func,
	};

	constructor(props) {
		super(props);
		const body = (props.item || {}).body || [];
		const disabled = Editor.isEmpty(body);

		// we put body on state so that for the case of a new note
		// and body doesn't have a value, the defaulted empty body
		// doesn't keep triggering a editor reset. (If Editor's
		// initialValue prop changes, it resets the editor-- and
		// this is by design, don't try to "fix it.)
		this.state = { body, disabled };

		this.attachTitleRef = ref => (this.title = ref);
		this.attachShareWithRef = ref => (this.shareWith = ref);
		this.attachEditorBodyRef = ref => (this.body = ref);

		const autoBind = ['detectContent', 'onCancel', 'onSubmit'];

		for (let fn of autoBind) {
			this[fn] = this[fn].bind(this);
		}
	}

	get canEditSharing() {
		const { item } = this.props;

		if (!item) {
			return true;
		}

		if (!item.isModifiable) {
			return false;
		}

		const refCount = item.ReferencedByCount;

		return refCount != null && refCount > 0;
	}

	detectContent() {
		const { body } = this;
		let disabled = body && Editor.isEmpty(body.getValue());
		//they may not be booleans... compare casted booleans
		if (Boolean(disabled) !== Boolean(this.state.disabled)) {
			this.setState({ disabled });
		}
	}

	stopFormSubmit(e) {
		e.preventDefault();
		return false;
	}

	render() {
		const {
			canEditSharing,
			props: { scope, item },
			state: { error, busy, disabled, body },
		} = this;

		const { sharedWith, title } = item;

		const errorMessage =
			error && (error.message || 'There was an errror saving');

		return (
			<div className={cx('note-editor-frame editor', { busy })}>
				<HideNavigation />

				<form onSubmit={this.stopFormSubmit}>
					<ShareWith
						scope={scope}
						defaultValue={sharedWith}
						ref={this.attachShareWithRef}
						onBlur={this.ensureVisible}
						readOnly={canEditSharing}
					/>

					<div
						className={cx('title', { error })}
						data-error-message={errorMessage}
					>
						<input
							type="text"
							name="title"
							ref={this.attachTitleRef}
							placeholder="Title"
							defaultValue={title || ''}
							onFocus={this.ensureVisible}
							onChange={this.detectContent}
						/>
					</div>

					<Editor
						ref={this.attachEditorBodyRef}
						onChange={this.detectContent}
						initialValue={body}
					>
						<button onClick={this.onCancel} className={'cancel'}>
							{t('cancel')}
						</button>
						<button
							onClick={this.onSubmit}
							className={cx('save', { disabled })}
						>
							<i className="icon-discuss small" />
							{t('post')}
						</button>
					</Editor>
				</form>
				{busy ? <Loading.Mask message="Saving..." /> : null}
			</div>
		);
	}

	onCancel(e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		const { onCancel } = this.props;

		onCancel(e);
	}

	onSubmit(e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		const {
			props: { item, onSubmit, onSave },
			state: { disabled },
			body,
			shareWith,
			title: { value: title },
		} = this;

		if (disabled) {
			return;
		}

		if (typeof onSubmit === 'function') {
			onSubmit(e);
		}

		const data = {
			title: Editor.isEmpty(title) ? null : title.trim(),
			body: body.getValue(),
			sharedWith: shareWith.getValue(),
		};

		this.setState({ busy: true }, () =>
			onSave(item, data)
				.then(() => this.setState({ busy: false }))
				.catch(error => this.setState({ busy: false, error }))
		);
	}
}
