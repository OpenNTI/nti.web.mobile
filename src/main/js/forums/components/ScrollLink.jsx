import React from 'react';

export default React.createClass({
	displayName: 'ReplyLink',

	propTypes: {
		componentId: React.PropTypes.string.isRequired
	},
	
	_clicked(event) {
		event.preventDefault();
		event.stopPropagation();
		let node = document.getElementById(this.props.componentId);
		if(node) {
			node.scrollIntoView(false);
			var input = node.querySelector('input, textarea, [contenteditable]');
			if (input) {
				input.focus();
			}
		}
	},

	render () {
		return (
			<a className="action-link scroll-link" onClick={this._clicked}>{this.props.children}</a>
		);
	}
});
