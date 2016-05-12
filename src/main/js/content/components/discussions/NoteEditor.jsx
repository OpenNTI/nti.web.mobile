import React from 'react';
import cx from 'classnames';

import {Editor} from 'modeled-content';

import Loading from 'common/components/Loading';
import HideNavigation from 'common/components/HideNavigation';

import ShareWith from 'common/components/ShareWith';

import t from 'common/locale';

export default React.createClass({
	displayName: 'NoteEditor',

	propTypes: {
		item: React.PropTypes.object,
		scope: React.PropTypes.object,

		onCancel: React.PropTypes.func,
		onSubmit: React.PropTypes.func,
		onSave: React.PropTypes.func
	},


	detectContent () {
		//set save button enabled or disabled.
	},

	stopFormSubmit (e) {
		e.preventDefault();
		return false;
	},

	render () {
		const {scope, item} = this.props;
		const {error, busy, disabled} = this.state || {};
		const {sharedWith, title, body} = item;

		const errorMessage = error && (error.message || 'There was an errror saving');

		return (
			<div className={cx('note-editor-frame editor', {busy})}>
				<HideNavigation/>

				<form onSubmit={this.stopFormSubmit}>
					<ShareWith scope={scope} defaultValue={sharedWith} ref={x => this.shareWith = x} onBlur={this.ensureVisible}/>

					<div className={cx('title', {error})} data-error-message={errorMessage}>
						<input type="text" name="title" ref={x => this.title = x} placeholder="Title"
							defaultValue={title || ''}
							onFocus={this.ensureVisible}
							onChange={this.detectContent} />
					</div>

					<Editor ref={x => this.body = x} onChange={this.detectContent} initialValue={body || []}>
						<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
						<button onClick={this.onSubmit} className={cx('save', {disabled})}><i className="icon-discuss"/>{t('BUTTONS.post')}</button>
					</Editor>
				</form>
				{busy ? ( <Loading message="Saving..."/> ) : null}
			</div>
		);
	},


	onCancel (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		const {onCancel} = this.props;

		onCancel(e);
	},


	onSubmit (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		const {props: {item, onSubmit, onSave}, body, shareWith, title: {value: title}} = this;

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
});
