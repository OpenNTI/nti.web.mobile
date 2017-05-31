import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
    static displayName = 'FilterMenuOption';

    static propTypes = {
		onClick: PropTypes.func,
		option: PropTypes.any,
		className: PropTypes.any
	};

    onClick = () => {
		const {onClick, option} = this.props;
		onClick && onClick(option);
	};

    render() {

		const {option, className} = this.props;

		return (
			<li key={option.value}
				className={className}
				onClick={this.onClick}>
				{option.label}
			</li>
		);
	}
}
