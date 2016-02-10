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


	render () {
		const {scope, item} = this.props;
		const {error, busy, disabled} = this.state || {};
		const {sharedWith, title, body} = item;

		const errorMessage = error && (error.message || 'There was an errror saving');

		return (
			<div className={cx('note-editor-frame editor', {busy})}>
				<HideNavigation/>

				<form onSubmit={x => x.preventDefault() && false}>
					<ShareWith scope={scope} defaultValue={sharedWith} ref="shareWith" onBlur={this.ensureVisible}/>

					<div className={cx('title', {error})} data-error-message={errorMessage}>
						<input type="text" name="title" ref="title" placeholder="Title"
							defaultValue={title || ''}
							onFocus={this.ensureVisible}
							onChange={this.detectContent} />
					</div>

					<Editor ref="body" onChange={this.detectContent} onBlur={this.detectContent} value={body || []}>
						<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
						<button onClick={this.onSubmit} className={cx('save', {disabled})}><i className="icon-discuss"/>{t('BUTTONS.post')}</button>
					</Editor>
				</form>
				{busy ? ( <Loading message="Saving..."/> ) : null}
			</div>
		);
	},


	onCancel (e) {
		const {onCancel} = this.props;

		onCancel(e);
	},


	onSubmit (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		const {props: {item, onSubmit, onSave}, refs: {body, shareWith, title: {value: title}}} = this;

		if (typeof onSubmit === 'function') {
			onSubmit(e);
		}

		const data = {
			title: Editor.isEmpty(title) ? void 0 : title.trim(),
			body: body.getValue(),
			sharedWith: shareWith.getValue()
		};

		this.setState({busy: true},
			()=> onSave(item, data)
				.then(() => this.setState({busy: false}))
				.catch(error => this.setState({busy: false, error})));
	}
});
