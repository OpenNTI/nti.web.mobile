import React from 'react';

export default React.createClass({
	displayName: 'NoteEditor',

	propTypes: {
		onCancel: React.PropTypes.func
	},

	render () {
		return (
			<div className="note-editor-frame" onClick={this.props.onCancel}/>
		);
	}
});
