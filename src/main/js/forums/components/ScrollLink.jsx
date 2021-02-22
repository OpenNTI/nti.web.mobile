import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
	static displayName = 'ScrollLink';

	static propTypes = {
		componentId: PropTypes.string.isRequired,

		children: PropTypes.any,
	};

	onClick = event => {
		event.preventDefault();
		event.stopPropagation();
		let node = document.getElementById(this.props.componentId);
		if (node) {
			node.scrollIntoView(true);
			let input = node.querySelector(
				'input, textarea, [contenteditable]'
			);
			if (input) {
				input.focus();
				input.scrollIntoView(true);
			}
		}
	};

	render() {
		return (
			<a className="action-link scroll-link" onClick={this.onClick}>
				{this.props.children}
			</a>
		);
	}
}
