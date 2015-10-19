import React from 'react';

export default React.createClass({
	displayName: 'ReplyLink',

	propTypes: {
		componentId: React.PropTypes.string.isRequired,

		children: React.PropTypes.any
	},


	onClick (event) {
		event.preventDefault();
		event.stopPropagation();
		let node = document.getElementById(this.props.componentId);
		if(node) {
			node.scrollIntoView(true);
			let input = node.querySelector('input, textarea, [contenteditable]');
			if (input) {
				input.focus();
			}
		}
	},


	render () {
		return (
			<a className="action-link scroll-link" onClick={this.onClick}>{this.props.children}</a>
		);
	}
});
