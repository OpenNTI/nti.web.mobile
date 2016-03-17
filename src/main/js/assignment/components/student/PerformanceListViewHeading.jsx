import React from 'react';

export default React.createClass({
	displayName: 'PerformanceListViewHeading',

	propTypes: {
		column: React.PropTypes.shape({
			label: React.PropTypes.string,
			sortOn: React.PropTypes.string
		}).isRequired,
		onClick: React.PropTypes.func,
		className: React.PropTypes.any
	},

	onClick () {
		const {onClick, column} = this.props;
		onClick && onClick(column.sortOn);
	},

	render () {

		const {className, column} = this.props;

		return (
			<div className={className} onClick={this.onClick}>
				{column.label}
			</div>
		);
	}
});
