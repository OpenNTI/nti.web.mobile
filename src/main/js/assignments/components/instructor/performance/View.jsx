import React from 'react';

import ContextSender from 'common/mixins/ContextSender';
import Navigatable from 'common/mixins/NavigatableMixin';

import FilterSearchBar from './FilterSearchBar';
import SummaryTable from './SummaryTable';

export default React.createClass({
	displayName: 'Performance',
	mixins: [ContextSender, Navigatable],

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

	getContext () {
		return {
			label: 'Grades & Performance',
			href: this.makeHref('/performance/')
		};
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
