import React from 'react';
import CSS from 'react/lib/CSSCore';
import cx from 'classnames';

import {Editor} from 'modeled-content';

import Loading from 'common/components/Loading';
import LockScroll from 'common/components/LockScroll';
import ShareWith from 'common/components/ShareWith';

import t from 'common/locale';

export default React.createClass({
	displayName: 'NoteEditor',

	propTypes: {
		item: React.PropTypes.object,

		onCancel: React.PropTypes.func,
		onSave: React.PropTypes.func
	},

	onChange (e) {
		let {value, name} = e.target;
		this.setState({[name]: value, error: void 0});
	},


	onBodyChanged (_, value) {
		this.setState({body: value, error: void 0});
	},


	getItemData () {
		let {item} = this.props;
		if (item.getData) {
			item = item.getData();
		}

		return item;
	},


	render () {
		let {error, busy, body, title} = this.state || {};

		let disabled = Editor.isEmpty(body);

		if (error) {
			error = error.message || 'There was an errror saving';
		}

		return (
			<div className={cx('note-editor-frame editor', {busy})}>
				<LockScroll/>
				<form onSubmit={x => x.preventDefault() && false}>
					<ShareWith />

					<div className={cx('title', {error})} data-error-message={error}>
						<input type="text" name="title"
							placeholder="Title"
							value={title}
							onChange={this.onChange} />
					</div>

					<Editor ref="body" value={body} onChange={this.onBodyChanged} onBlur={this.onBodyChange}>
						<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
						<button onClick={this.onSubmit} className={cx('save icon-discuss', {disabled})}>{t('BUTTONS.post')}</button>
					</Editor>
				</form>
				{busy ? ( <Loading message="Saving..."/> ) : null}
			</div>
		);
	},


	onCancel (e) {
		let {onCancel} = this.props;
		let dom = React.findDOMNode(this);

		CSS.removeClass(dom.parentNode, 'saving');

		onCancel(e);
	},


	onSubmit () {
		let item = this.getItemData();
		let {onSave} = this.props;
		let {title} = this.state || {};
		let {body} = this.refs;

		let dom = React.findDOMNode(this);

		CSS.addClass(dom.parentNode, 'saving');

		let data = Object.assign({}, item, {
			title: Editor.isEmpty(title) ? null : title.trim(),
			body: body.getValue(),
			sharedWith: []
		});

		this.setState({busy: true},
			()=> onSave(data)
				.then(() => this.setState({busy: false}))
				.catch(error => this.setState({busy: false, error})));
	}
});
