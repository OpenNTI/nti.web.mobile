import React from 'react';

import FilterSearchBar from './FilterSearchBar';
import SummaryTable from './SummaryTable';

export default React.createClass({
	displayName: 'Performance',

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	render () {

		const {assignments} = this.props;
		const summary = assignments.getSummary();

		return (
			<div className="performance-view">
				<FilterSearchBar summary={summary} />
				<SummaryTable summary={summary} />
			</div>
		);
	}
});
