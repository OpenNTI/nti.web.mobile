import React from 'react';
import {rawContent, Array as ArrayUtils} from 'nti-commons';

import TableCell from './TableCell';


const RANK = ['first', 'second'];

export default function TableRow ({columns, label, labelPrefix, series}) {

	const ranks = ArrayUtils.unique(series.map(x => x.count)).sort().reverse();

	const applyRank = o => Object.assign({rank: RANK[ranks.indexOf(o.count)]}, o);

	const row = columns.map(col =>
		applyRank(
			series.find(x => x.label === col) || {label: col, count: 0, percent: 0}));

	return (
		<tr>
			<td className="axis-label">
				{!!labelPrefix && ( <strong>{labelPrefix}</strong> )}
				<span {...rawContent(label)} />
			</td>

			{row.map((x, i) =>
				<TableCell key={i} {...x}/>
			)}
		</tr>
	);
}

TableRow.propTypes = {
	columns: React.PropTypes.array,
	label: React.PropTypes.string,
	labelPrefix: React.PropTypes.string,
	series: React.PropTypes.arrayOf(React.PropTypes.shape({
		label: React.PropTypes.string,
		count: React.PropTypes.number,
		percent: React.PropTypes.number.isRequired
	}))
};
