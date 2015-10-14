import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cx from 'classnames';

import {ToolMixin, Constants} from 'react-editor-component';

import getEventTarget from 'nti.lib.dom/lib/geteventtarget';

import {getHandler} from 'video/services';

import VideoIcon from './editor-parts/VideoIcon';

export default React.createClass({
	displayName: 'InsertVideoButton',
	mixins: [ToolMixin],

	statics: {
		service: 'kaltura'
	},


	getInitialState () {
		return {
			prompt: false
		};
	},

	componentDidUpdate () {
		this.focus();
	},

	focus (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		const {input} = this.refs;
		if (input) {
			input.focus();
		}
	},


	testURL () {
		const {refs: {input}} = this;
		const {value} = input || {};

		const handler = getHandler(value);
		this.setState({canSubmit: !!handler});
	},


	render () {
		const {state: {prompt, canSubmit}} = this;

		return (
			<div className="button insert-video" onClick={this.prompt}>
				Insert Video
				{!prompt ? null : (
					<div className="dialog" onClick={this.focus}>
						<input type="url" placeholder="Video URL" ref="input" onChange={this.testURL}/>
						<div className="buttons">
							<a className="button link" onClick={this.closePrompt}>Cancel</a>
							<a className={cx('button commit', {disabled: !canSubmit})} onClick={this.insert}>Insert</a>
						</div>
					</div>
				)}
			</div>
		);
	},





	closePrompt (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		// this.getEditor().clearBusy();
		this.replaceState({prompt: false});
	},


	prompt (e) {
		e.stopPropagation();
		if (getEventTarget(e, '.dialog')) {
			return;
		} else {
			e.preventDefault();
		}

		const editor = this.getEditor();
		const selection = editor[Constants.SAVED_SELECTION];
		// editor.markBusy();

		this.setState({selection, prompt: true});
	},


	insert (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}


		const {state: {selection}, refs: {input}} = this;
		const {value} = input || {};
		const editor = this.getEditor();

		if (selection) {
			editor.restoreSelection(selection);
		}

		const handler = getHandler(value);

		const data = handler && {
			MimeType: 'application/vnd.nextthought.embeddedvideo',
			embedURL: value,
			type: handler.service
		};

		if (!handler) {
			// input.value = '';
			console.warn('Bad Video URL');
			return;
		}


		const markup = ReactDOMServer.renderToStaticMarkup(
			React.createElement(VideoIcon, { data }));

		const node = editor.insertAtSelection(markup);

		this.closePrompt();
		if (node) {
			let s = document.getSelection();
			s.selectAllChildren(node);
			s.collapseToEnd();

			setTimeout(()=> node.scrollIntoView(), 500);
		}
	}
});
