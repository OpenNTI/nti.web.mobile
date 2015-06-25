import React from 'react';

export default React.createClass({
	displayName: 'Editable',

	propTypes: {
		tag: React.PropTypes.string,
		children: React.PropTypes.any
	},

	focus () {
		let r = document.createRange();
		r.selectNodeContents(React.findDOMNode(this));
		r.collapse();
		let sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(r);
	},

	onBlur () {
		console.debug('post update for editable');
	},

	render () {

		let Tag = this.props.tag || 'div';

		return (
			<Tag contentEditable="true" onTouchEnd={this.focus} onBlur={this.onBlur}>{this.props.children}</Tag>
		);
	}
});
