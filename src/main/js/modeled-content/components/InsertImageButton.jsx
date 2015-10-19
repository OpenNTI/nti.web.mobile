import React from 'react';
import ReactDOMServer from 'react-dom/server';

import WhiteboardRenderer from 'nti.lib.whiteboardjs/lib/Canvas';

import {createFromImage, URL} from 'nti.lib.whiteboardjs/lib/utils';

import {ToolMixin, Constants} from 'react-editor-component';

import WhiteboardIcon from './editor-parts/WhiteboardIcon';

import iOSversion from 'common/utils/ios-version';

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

		WhiteboardRenderer
			.getThumbnail(scene, false)
				.then(thumbnail=> {

					let markup = ReactDOMServer.renderToStaticMarkup(
						React.createElement(WhiteboardIcon, {
							thumbnail,
							scene
						}));

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
					console.error(e);
					alert(e);//eslint-disable-line
				});
	},


	onError () {
		console.debug('Oops...');
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
		let editor = this.getEditor();
		let {files} = e.target;
		const logError = er => console.log(er.stack || er.message || er);

		if (!files || files.length === 0) { return; }

		let sel = editor[Constants.SAVED_SELECTION];
		if (sel) {
			editor.restoreSelection(sel);
		}

		let getNext = (file, last) => ()=>this.readFile(file, last);

		editor.markBusy();

		let run = Promise.resolve();
		for(let i = 0, len = files.length; i < len; i++) {
			run = run
				.catch(logError)
				.then(getNext(files[i], (len - 1) === i));
		}

		run.catch(logError)
			.then(()=>editor.clearBusy());
	}
});
