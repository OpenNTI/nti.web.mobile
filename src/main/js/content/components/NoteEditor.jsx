import React from 'react';
import CSS from 'react/lib/CSSCore';
import cx from 'classnames';

import {Editor} from 'modeled-content';

import Loading from 'common/components/Loading';
import DarkMode from 'common/components/DarkMode';
import HideNavigation from 'common/components/HideNavigation';

import ShareWith from 'common/components/ShareWith';

import t from 'common/locale';

export default React.createClass({
	displayName: 'NoteEditor',

	propTypes: {
		item: React.PropTypes.object,
		scope: React.PropTypes.object,

		onCancel: React.PropTypes.func,
		onSave: React.PropTypes.func
	},


	detectContent () {
		//set save button enabled or disabled.
	},


	getItemData () {
		let {item} = this.props;
		if (item.getData) {
			item = item.getData();
		}

		return item;
	},


	render () {
		let {scope} = this.props;
		let {error, busy, disabled} = this.state || {};

		if (error) {
			error = error.message || 'There was an errror saving';
		}

		return (
			<div className={cx('note-editor-frame editor', {busy})}>
				<DarkMode/>
				<HideNavigation/>

				<form onSubmit={x => x.preventDefault() && false}>
					<ShareWith scope={scope}/>

					<div className={cx('title', {error})} data-error-message={error}>
						<input type="text" name="title" ref="title" placeholder="Title"
							onChange={this.detectContent} />
					</div>

					<Editor ref="body" onChange={this.detectContent} onBlur={this.detectContent}>
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
		let {body, title} = this.refs;

		let dom = React.findDOMNode(this);
		CSS.addClass(dom.parentNode, 'saving');

		title = title.value;

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
