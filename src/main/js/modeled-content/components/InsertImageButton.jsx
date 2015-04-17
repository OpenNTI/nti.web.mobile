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
				<input type="file" onChange={this.onSelect}/>
			</button>
		);
	},


	insertWhiteboard (scene) {
		let editor = this.getEditor();

		WhiteboardRenderer
			.getThumbnail(scene)
				.then(thumbnail=> {
					let markup = React.renderToStaticMarkup(
						React.createElement(WhiteboardIcon, {
							thumbnail,
							scene
						}));

					if (!editor.insertAtSelection(markup)) {
						console.error('No seletion to insert');
					}
				});
	},


	onError () {
		console.debug('Oops...');
	},


	onSelect (e) {
		let editor = this.getEditor();
		let reader = new FileReader();
		let img = new Image();
		let file = e.target.files[0];

		let sel = editor[Constants.SAVED_SELECTION];
		if (sel){
			editor.restoreSelection(sel);
		}

		img.onerror = this.onError;
		img.onload = ()=> createFromImage(img).then(this.insertWhiteboard, this.onError);

		//file.size
		if (!file || !(/image\/.*/i).test(file.type)) {
			alert('Please Select an Image');//eslint-disable-line no-alert
			return;
		}


		reader.onload = event => img.src = event.target.result;
		reader.readAsDataURL(file);
	}
});
