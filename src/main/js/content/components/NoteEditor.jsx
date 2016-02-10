import React from 'react';
import CSS from 'fbjs/lib/CSSCore';

import DarkMode from 'common/components/DarkMode';

import Editor from './discussions/NoteEditor';

export default React.createClass({
	displayName: 'content:NoteEditor',

	propTypes: {
		item: React.PropTypes.object,
		scope: React.PropTypes.object,

		onCancel: React.PropTypes.func,
		onSave: React.PropTypes.func
	},


	ensureVisible () {
		let {refs: {editor: el}} = this;
		let margin = parseInt(getComputedStyle(el)['margin-top'], 10);

		let top = 0;
		while(el) {
			top += el.offsetTop;
			el = el.offsetParent;
		}

		window.scrollTo(0, top - margin + 1);
	},


	onCancel () {
		const {props: {onCancel}, refs: {el: {parentNode}}} = this;

		CSS.removeClass(parentNode, 'saving');

		onCancel();
	},


	onSubmit () {
		const {refs: {el: {parentNode}}} = this;
		CSS.addClass(parentNode, 'saving');
	},


	render () {
		return (
			<div ref="el">
				<DarkMode/>
				<Editor ref="editor" {...this.props} onCancel={this.onCancel} onSubmit={this.onSubmit}/>
			</div>
		);
	}
});
