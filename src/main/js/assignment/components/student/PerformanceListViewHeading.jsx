import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
	static displayName = 'PerformanceListViewHeading';

	static propTypes = {
		column: PropTypes.shape({
			label: PropTypes.string,
			sortOn: PropTypes.string
		}).isRequired,
		onClick: PropTypes.func,
		className: PropTypes.any
	};

	onClick = () => {
		const {onClick, column} = this.props;
		onClick && onClick(column.sortOn);
	};

	render () {

		const {className, column} = this.props;

		return (
			<div className={className} onClick={this.onClick}>
				{column.label}
			</div>
		);
	}
}
