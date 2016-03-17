import React from 'react';

export default React.createClass({
	displayName: 'ColumnHeading',

	propTypes: {
		column: React.PropTypes.shape({
			sort: React.PropTypes.string.isRequired,
			label: React.PropTypes.func.isRequired
		}).isRequired,
		onClick: React.PropTypes.func,
		className: React.PropTypes.any
	},

	onClick () {
		const {column, onClick} = this.props;
		onClick && onClick(column);
	},

	render () {

		const {column, className} = this.props;

		return (
			<div
				key={column.label()}
				onClick={this.onClick}
				className={className}>
					<span className="heading">{column.label()}</span>
					<span className="sort-arrow" />
			</div>
		);
	}
});
