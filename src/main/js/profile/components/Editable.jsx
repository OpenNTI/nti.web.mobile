import React from 'react';
import PropTypes from 'prop-types';

export default class Editable extends React.Component {
	static propTypes = {
		tag: PropTypes.string,
		children: PropTypes.any,
	};

	attachRef = el => (this.el = el);

	focus = () => {
		let r = document.createRange();
		r.selectNodeContents(this.el);
		r.collapse();
		let sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(r);
	};

	onBlur = () => {};

	render() {
		const Tag = this.props.tag || 'div';

		return (
			<Tag
				ref={this.attachRef}
				contentEditable="true"
				onTouchEnd={this.focus}
				onBlur={this.onBlur}
			>
				{this.props.children}
			</Tag>
		);
	}
}
