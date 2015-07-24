import React from 'react';

export default React.createClass({
	displayName: 'AddEntryButton',

	propTypes: {
		onClick: React.PropTypes.func.isRequired
	},

	render () {
		return (
			<button className="add-entry-button tiny" onClick={this.props.onClick}>Add Entry</button>
		);
	}
});
