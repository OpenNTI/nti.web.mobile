import React from 'react';

import mixin from './mixin';

export default React.createClass({
	displayName: 'Matrix',

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	mixins: [mixin],

	render () {

		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		return (
			<div>
				<div>{element.label}</div>
				<table>
					<thead>
						<tr>
							<th></th>
							{element.columns.map(c => <th key={c}>{c}</th>)}
						</tr>
					</thead>
					<tbody>
						{element.rows.map(r => (
							<tr key={r}>
								<td>{r}</td>
								{element.columns.map(c => <td key={c}><input type="radio" name={`${element.name}-${r}`} /></td>)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
});
