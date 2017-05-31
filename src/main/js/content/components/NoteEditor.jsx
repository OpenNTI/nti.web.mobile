import React from 'react';

import {addClass, removeClass} from 'nti-lib-dom';
import {DarkMode} from 'nti-web-commons';

import Editor from './discussions/NoteEditor';

export default class extends React.Component {
    static displayName = 'content:NoteEditor';

    static propTypes = {
		item: React.PropTypes.object,
		scope: React.PropTypes.object,

		onCancel: React.PropTypes.func,
		onSave: React.PropTypes.func
	};

    ensureVisible = () => {
		let {editor: el} = this;
		let margin = parseInt(getComputedStyle(el)['margin-top'], 10);

		let top = 0;
		while(el) {
			top += el.offsetTop;
			el = el.offsetParent;
		}

		window.scrollTo(0, top - margin + 1);
	};

    onCancel = () => {
		const {props: {onCancel}, el: {parentNode}} = this;

		removeClass(parentNode, 'saving');

		onCancel();
	};

    onSubmit = () => {
		const {el: {parentNode}} = this;
		addClass(parentNode, 'saving');
	};

    render() {
		return (
			<div ref={x => this.el = x}>
				<DarkMode/>
				<Editor ref={x => this.editor = x} {...this.props} onCancel={this.onCancel} onSubmit={this.onSubmit}/>
			</div>
		);
	}
}
