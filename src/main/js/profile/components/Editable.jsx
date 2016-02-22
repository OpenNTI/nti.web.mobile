import React from 'react';

export default React.createClass({
	displayName: 'Editable',

	propTypes: {
		tag: React.PropTypes.string,
		children: React.PropTypes.any
	},

	focus () {
		let r = document.createRange();
		r.selectNodeContents(this.el);
		r.collapse();
		let sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(r);
	},

	onBlur () {
	},

	render () {
		const Tag = this.props.tag || 'div';

		return (
			<Tag ref={el => this.el = el} contentEditable="true" onTouchEnd={this.focus} onBlur={this.onBlur}>{this.props.children}</Tag>
		);
	}
});
