import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
	static displayName = 'RemoveIcon';

	static propTypes = {
		onClick: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
	};

	onClick = () => {
		const { onClick, index } = this.props;
		onClick && index > -1 && onClick(index);
	};

	render() {
		return <b onClick={this.onClick} className="remove icon-bold-x" />;
	}
}
