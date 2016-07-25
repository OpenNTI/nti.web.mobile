import React from 'react';
import cx from 'classnames';

import {Editor} from 'modeled-content';

import {Loading, HideNavigation} from 'nti-web-commons';

import ShareWith from 'common/components/ShareWith';

import t from 'nti-lib-locale';

export default class NoteEditor extends React.Component {

	static propTypes = {
		item: React.PropTypes.object,
		scope: React.PropTypes.object,

		onCancel: React.PropTypes.func,
		onSubmit: React.PropTypes.func,
		onSave: React.PropTypes.func
	}


	constructor (props) {
		super(props);
		const body = (props.item || {}).body || [];
		const disabled = Editor.isEmpty(body);

		// we put body on state so that for the case of a new note
		// and body doesn't have a value, the defaulted empty body
		// doesn't keep triggering a editor reset. (If Editor's
		// initialValue prop changes, it resets the editor-- and
		// this is by design, don't try to "fix it.)
		this.state = {body, disabled};

		this.attachTitleRef = ref => this.title = ref;
		this.attachShareWithRef = ref => this.shareWith = ref;
		this.attachEditorBodyRef = ref => this.body = ref;

		const autoBind = [
			'detectContent',
			'onCancel',
			'onSubmit'
		];

		for (let fn of autoBind) {
			this[fn] = this[fn].bind(this);
		}
	}


	detectContent () {
		const {body} = this;
		let disabled = body && Editor.isEmpty(body.getValue());
		//they may not be booleans... compare casted booleans
		if (Boolean(disabled) !== Boolean(this.state.disabled)) {
			this.setState({disabled});
		}
	}


	stopFormSubmit (e) {
		e.preventDefault();
		return false;
	}


	render () {
		const {
			props: {
				scope,
				item
			},
			state: {
				error,
				busy,
				disabled,
				body
			}
		} = this;

		const {sharedWith, title} = item;

		const errorMessage = error && (error.message || 'There was an errror saving');

		return (
			<div className={cx('note-editor-frame editor', {busy})}>
				<HideNavigation/>

				<form onSubmit={this.stopFormSubmit}>
					<ShareWith scope={scope} defaultValue={sharedWith} ref={this.attachShareWithRef} onBlur={this.ensureVisible}/>

					<div className={cx('title', {error})} data-error-message={errorMessage}>
						<input type="text" name="title" ref={this.attachTitleRef} placeholder="Title"
							defaultValue={title || ''}
							onFocus={this.ensureVisible}
							onChange={this.detectContent} />
					</div>

					<Editor ref={this.attachEditorBodyRef} onChange={this.detectContent} initialValue={body}>
						<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
						<button onClick={this.onSubmit} className={cx('save', {disabled})}><i className="icon-discuss small"/>{t('BUTTONS.post')}</button>
					</Editor>
				</form>
				{busy ? ( <Loading message="Saving..."/> ) : null}
			</div>
		);
	}


	onCancel (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		const {onCancel} = this.props;

		onCancel(e);
	}


	onSubmit (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		const {
			props: {item, onSubmit, onSave},
			state: {disabled},
			body,
			shareWith,
			title: {value: title}
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
			sharedWith: shareWith.getValue()
		};

		this.setState({busy: true},
			()=> onSave(item, data)
				.then(() => this.setState({busy: false}))
				.catch(error => this.setState({busy: false, error})));
	}
}
