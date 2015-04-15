import React from 'react';

export default React.createClass({
	displayName: 'InsertImageButton',

	render () {
		return (
			<button className="insert-whiteboard">
				Insert Whiteboard
				<input type="file" onChange={this.onSelect}/>
			</button>
		);
	},


	onSelect (e) {
		console.log(e.target.files);
	}
});
