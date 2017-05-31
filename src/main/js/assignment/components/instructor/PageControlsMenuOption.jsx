import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
	static displayName = 'PageControlsMenuOption';

	static propTypes = {
		onClick: PropTypes.func,
		page: PropTypes.number,
		className: PropTypes.any,
		children: PropTypes.any
	};

	onClick = () => {
		const {onClick, page} = this.props;
		onClick && onClick(page);
	};

	render () {

		const {className, children} = this.props;

		return (
			<li className={className} onClick={this.onClick}>
				{children}
			</li>
		);
	}
}
