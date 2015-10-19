import React from 'react';

import If from 'common/components/Conditional';

import TableCell from './TableCell';

import unique from 'nti.lib.interfaces/utils/array-unique';

const RANK = ['first', 'second'];

export default React.createClass({
	displayName: 'TableRow',

	propTypes: {
		columns: React.PropTypes.array,
		label: React.PropTypes.string,
		labelPrefix: React.PropTypes.string,
		series: React.PropTypes.arrayOf(React.PropTypes.shape({
			label: React.PropTypes.string,
			count: React.PropTypes.number,
			percent: React.PropTypes.number.isRequired
		}))
	},

	render () {
		const {props: {columns, label, labelPrefix, series}} = this;

		const ranks = unique(series.map(x => x.count)).sort().reverse();

		const applyRank = o => Object.assign({rank: RANK[ranks.indexOf(o.count)]}, o);

		const row = columns.map(col =>
			applyRank(
				series.find(x => x.label === col) || {label: col, count: 0, percent: 0}));

		return (
			<tr>
				<td className="axis-label">
					<If tag="strong" condition={!!labelPrefix}>
						{labelPrefix}
					</If>
					{label}
				</td>

				{row.map((x, i) =>
					<TableCell key={i} {...x}/>
				)}
			</tr>
		);
	}
});
