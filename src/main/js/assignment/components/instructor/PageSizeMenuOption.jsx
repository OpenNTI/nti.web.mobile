import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
    static displayName = 'PageSizeMenuOption';

    static propTypes = {
		value: PropTypes.string,
		onClick: PropTypes.func,
		className: PropTypes.any
	};

    onClick = () => {
		const {value, onClick} = this.props;
		onClick && onClick(value);
	};

    render() {

		const {value, className} = this.props;

		return (
			<li className={className} onClick={this.onClick}>
				{`${value} students per page`}
			</li>
		);
	}
}
