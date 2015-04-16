import React from 'react';

import {createFromImage} from 'nti.lib.whiteboardjs/lib/utils';

export default React.createClass({
	displayName: 'InsertImageButton',

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


	insertWhiteboard (data) {
		console.log(data);
	},


	onError () {
		console.debug('Oops...');
	},


	onSelect (e) {
		let reader = new FileReader();
		let img = new Image();
		let file = e.target.files[0];

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
