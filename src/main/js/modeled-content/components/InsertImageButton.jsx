import React from 'react';

import WhiteboardRenderer from 'nti.lib.whiteboardjs/lib/Canvas';

import {createFromImage} from 'nti.lib.whiteboardjs/lib/utils';

import {ToolMixin, Constants} from 'react-editor-component';

import WhiteboardIcon from './editor-parts/WhiteboardIcon';

export default React.createClass({
	displayName: 'InsertImageButton',
	mixins: [ToolMixin],

	render () {
		if (typeof FileReader === 'undefined') {
			return null;//don't render the button.
		}

		return (
			<button className="insert-whiteboard">
				Insert Whiteboard
				<input type="file" accept="image/*" multiple onChange={this.onSelect}/>
			</button>
		);
	},


	insertWhiteboard (scene, last) {
		let editor = this.getEditor();

		WhiteboardRenderer
			.getThumbnail(scene)
				.then(thumbnail=> {

					let markup = React.renderToStaticMarkup(
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
				.catch(e=>{
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
			let reader = new FileReader();
			let img = new Image();

			if (!(/image\/.*/i).test(file.type)) {
				return;
			}

			img.onerror = e => error(e);
			img.onload = ()=> createFromImage(img)
								.then(scene=>this.insertWhiteboard(scene, last), error)
								.then(finish, error);

			reader.onerror = reader.onabort = e => error(e);
			reader.onload = event => {
				img.src = event.target.result;
			};

			reader.readAsDataURL(file);
		});
	},


	onSelect (e) {
		let editor = this.getEditor();
		let {files} = e.target;

		if (!files || files.length === 0) { return; }

		let sel = editor[Constants.SAVED_SELECTION];
		if (sel){
			editor.restoreSelection(sel);
		}

		let getNext = (file, last) => ()=>this.readFile(file, last);

		editor.markBusy();

		let run = Promise.resolve();
		for(let i = 0, len = files.length; i < len; i++) {
			run = run.then(getNext(files[i], (len-1)===i));
		}

		run.then(()=>editor.clearBusy());
	}
});
