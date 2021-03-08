import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { Component as ContextSender } from 'internal/common/mixins/ContextSender';

import Assignments from '../../bindings/Assignments';

import FilterSearchBar from './FilterSearchBar';
import SummaryTable from './SummaryTable';

class Performance extends React.Component {
	static propTypes = {
		assignments: PropTypes.object,
	};

	state = this.getSummary();

	componentDidUpdate(prevProps) {
		if (this.props.assignments !== prevProps.assignments) {
			this.setState(this.getSummary());
		}
	}

	getSummary({ assignments } = this.props) {
		return { summary: assignments.getSummary() };
	}

	render() {
		const { summary } = this.state;
		return (
			<div className="performance-view">
				<ContextSender getContext={getContext} />
				<FilterSearchBar summary={summary} />
				<SummaryTable summary={summary} />
			</div>
		);
	}
}

async function getContext() {
	const context = this; //this will be called with the contextSender's context ("this")
	return {
		label: 'Grades & Performance',
		href: context.makeHref('/performance/'),
	};
}

export default decorate(Performance, [Assignments.connect]);
