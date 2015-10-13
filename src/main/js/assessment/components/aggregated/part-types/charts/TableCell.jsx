import React from 'react';
import cx from 'classnames';


export default React.createClass({
	displayName: 'TableCell',

	propTypes: {
		label: React.PropTypes.string,
		count: React.PropTypes.number,
		percent: React.PropTypes.number,
		total: React.PropTypes.number,
		rank: React.PropTypes.oneOf(['first', 'second', 'none'])
	},

	getDefaultProps () {
		return {
			rank: 'none'
		};
	},


	render () {
		const {props: {count, percent, rank, label}} = this;

		const cls = cx({
			['rank-' + rank]: rank
		});

		const percentString = (percent || 0).toFixed(2);

		return (
			<td className={cls} data-count={count} data-for={label}>
				{percentString}
			</td>
		);
	}
});
