import React from 'react';

import FilterSearchBar from './FilterSearchBar';
import SummaryTable from './SummaryTable';

export default React.createClass({
	displayName: 'Performance',

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	componentWillMount () {
		const {assignments} = this.props;
		const summary = assignments.getSummary();
		summary.addListener('change', this.onStoreChange);
	},

	componentWillUnmount () {
		const {assignments} = this.props;
		const summary = assignments.getSummary();
		summary.removeListener('change', this.onStoreChange);
	},

	onStoreChange () {
		this.forceUpdate();
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
