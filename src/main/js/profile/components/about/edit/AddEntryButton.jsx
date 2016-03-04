import React from 'react';

export default React.createClass({
	displayName: 'AddEntryButton',

	propTypes: {
		onClick: React.PropTypes.func.isRequired
	},

	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		this.props.onClick.call();
	},

	render () {
		return (
			<a className="add-entry-button button tiny" onClick={this.onClick}>Add Entry</a>
		);
	}
});
