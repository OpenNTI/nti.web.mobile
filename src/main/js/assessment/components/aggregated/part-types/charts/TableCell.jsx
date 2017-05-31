import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';


export default class extends React.Component {
	static displayName = 'TableCell';

	static propTypes = {
		label: PropTypes.string,
		count: PropTypes.number,
		percent: PropTypes.number,
		total: PropTypes.number,
		rank: PropTypes.oneOf(['first', 'second', 'none'])
	};

	static defaultProps = {
		rank: 'none'
	};

	render () {
		const {props: {count, rank, label}} = this;

		const cls = cx({
			['rank-' + rank]: rank
		});

		// const percentString = (percent || 0).toFixed(2);

		return (
			<td className={cls} data-count={count} data-for={label}>
				{/*percentString*/count}
			</td>
		);
	}
}
