import PropTypes from 'prop-types';
import React from 'react';

import { rawContent, Array as ArrayUtils } from '@nti/lib-commons';

import TableCell from './TableCell';

const RANK = ['first', 'second'];

export default function TableRow({ columns, label, labelPrefix, series }) {
	const ranks = ArrayUtils.unique(series.map(x => x.count))
		.sort()
		.reverse();

	const applyRank = o => ({ rank: RANK[ranks.indexOf(o.count)], ...o });

	const row = columns.map(col =>
		applyRank(
			series.find(x => x.label === col) || {
				label: col,
				count: 0,
				percent: 0,
			}
		)
	);

	return (
		<tr>
			<td className="axis-label">
				{!!labelPrefix && <strong>{labelPrefix}</strong>}
				<span {...rawContent(label)} />
			</td>

			{row.map((x, i) => (
				<TableCell key={i} {...x} />
			))}
		</tr>
	);
}

TableRow.propTypes = {
	columns: PropTypes.array,
	label: PropTypes.string,
	labelPrefix: PropTypes.string,
	series: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			count: PropTypes.number,
			percent: PropTypes.number.isRequired,
		})
	),
};
