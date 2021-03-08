import './TableChart.scss';
import PropTypes from 'prop-types';
import React from 'react';

import { rawContent } from '@nti/lib-commons';

import TableRow from './TableRow';

function concatUnique(list, toappend) {
	const newItems = toappend.filter(x => list.indexOf(x) === -1);
	if (newItems.length > 0) {
		list = [...list, ...newItems];
	}
	return list;
}

export default function TableChart({ data }) {
	const columnItems = data.reduce(
		(a, x) =>
			concatUnique(
				a,
				x.series.map(s => s.label)
			),
		[]
	);

	return (
		<table className="table-chart">
			<thead>
				<tr>
					<th />
					{columnItems.map(label => (
						<th key={label} {...rawContent(label)} />
					))}
				</tr>
			</thead>
			<tbody className="scene">
				{data.map(x => (
					<TableRow key={x.label} columns={columnItems} {...x} />
				))}
			</tbody>
		</table>
	);
}

TableChart.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			labelPrefix: PropTypes.string,
			series: PropTypes.arrayOf(
				PropTypes.shape({
					label: PropTypes.string,
					count: PropTypes.number,
					percent: PropTypes.number.isRequired,
				})
			),
		})
	),
};
