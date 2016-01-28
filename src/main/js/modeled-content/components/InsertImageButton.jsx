import React from 'react';
import Logger from 'nti-util-logger';
import {createFromImage, URL} from 'nti-lib-whiteboardjs/lib/utils';

import {ToolMixin, Constants} from 'react-editor-component';

import WhiteboardIcon from './editor-parts/WhiteboardIcon';

import iOSversion from 'common/utils/ios-version';

const logger = Logger.get('modeled-content:components:InsertImageButton');

export default React.createClass({
	displayName: 'InsertImageButton',
	mixins: [ToolMixin],


	getInitialState () {
		return {
			disabled: true
		};
	},


	componentWillMount () {
		let iOSV = iOSversion();
		if (iOSV == null || iOSV[0] > 7) {
			this.setState({disabled: false});
		}
	},


	render () {
		if (!URL || this.state.disabled) {
			return null;//don't render the button.
		}

		return (
			<div className="button insert-whiteboard">
				Insert Whiteboard
				<input type="file" accept="image/*" multiple onChange={this.onSelect}/>
			</div>
		);
	},


	insertWhiteboard (scene, last) {
		let editor = this.getEditor();

		WhiteboardIcon.renderIcon(scene)
			.then(markup => {

				let node = editor.insertAtSelection(markup);
				if (node) {
					let s = document.getSelection();
					s.selectAllChildren(node);
					s.collapseToEnd();

					if (last) {
						setTimeout(()=> node.scrollIntoView(), 500);
					} else {
						node.scrollIntoView();
					}
				}

			})
			.catch(e=> {
				e = JSON.stringify(e);
				logger.error(e);
				alert(e);//eslint-disable-line
			});
	},


	onError () {
		logger.debug('Oops...');
	},


	readFile (file, last) {
		return new Promise((finish, error) => {
			let img = new Image(), src;

			if (!(/image\/.*/i).test(file.type)) {
				return;
			}

			img.onerror = e => error(e);
			img.onload = ()=> createFromImage(img)
								.then(scene=>this.insertWhiteboard(scene, last), error)
								.then(finish, error)
								.then(()=> URL.revokeObjectURL(src));

			img.src = src = URL.createObjectURL(file);
		});
	},


	onSelect (e) {
		const editor = this.getEditor();
		const {target: {files}} = e;

		const logError = er => logger.log(er.stack || er.message || er);

		if (!files || files.length === 0) { return; }

		let sel = editor[Constants.SAVED_SELECTION];
		if (sel) {
			editor.restoreSelection(sel);
		}

		let getNext = (file, last) => ()=>this.readFile(file, last);

		editor.markBusy();

		let run = Promise.resolve();
		const fileList = Array.from(files);
		for(let i = 0, len = fileList.length; i < len; i++) {
			run = run
				.catch(logError)
				.then(getNext(fileList[i], (len - 1) === i));
		}

		run.catch(logError)
			.then(()=>editor.clearBusy());

		//These three lines allow the same file to be selected over and over again.
		e.target.value = null;
		e.preventDefault();
		e.stopPropagation();
	}
});
