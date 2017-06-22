import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
	static displayName = 'ColumnHeading';

	static propTypes = {
		column: (o, k) => {
			try {
				if (typeof o[k].label !== 'function') {
					throw new Error('not a function');
				}
			} catch (e) {
				return new Error(`${k} is required, and needs to be something that has a label() method.`);
			}
		},
		onClick: PropTypes.func,
		className: PropTypes.any
	};

	onClick = () => {
		const {column, onClick} = this.props;
		onClick && onClick(column);
	};

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
}
