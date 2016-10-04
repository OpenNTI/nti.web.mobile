import React from 'react';
import {rawContent} from 'nti-commons';

import TableRow from './TableRow';

function concatUnique (list, toappend) {
	const newItems = toappend.filter(x => list.indexOf(x) === -1);
	if (newItems.length > 0) {
		list = [...list, ...newItems];
	}
	return list;
}

export default function TableChart ({data}) {
	const columnItems = data.reduce((a, x) => concatUnique(a, x.series.map(s => s.label)), []);

	return (
		<table className="table-chart">
			<thead>
				<tr>
					<th/>
					{columnItems.map(label =>
						<th key={label} {...rawContent(label)} />
					)}
				</tr>
			</thead>
			<tbody className="scene">
				{data.map((x)=>
					<TableRow key={x.label} columns={columnItems} {...x}/>
				)}
			</tbody>
		</table>
	);
}

TableChart.propTypes = {
	data: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			label: React.PropTypes.string.isRequired,
			labelPrefix: React.PropTypes.string,
			series: React.PropTypes.arrayOf(
				React.PropTypes.shape({
					label: React.PropTypes.string,
					count: React.PropTypes.number,
					percent: React.PropTypes.number.isRequired
				}))
		}))
};
