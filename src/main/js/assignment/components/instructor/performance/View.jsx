import React from 'react';
import PropTypes from 'prop-types';

import {Component as ContextSender} from 'common/mixins/ContextSender';

import Assignments from '../../bindings/Assignments';

import FilterSearchBar from './FilterSearchBar';
import SummaryTable from './SummaryTable';


export default
@Assignments.connect
class Performance extends React.Component {
	static propTypes = {
		assignments: PropTypes.object
	}


	componentWillMount () {
		this.loadSummary();
	}


	componentWillReceiveProps (nextProps) {
		if (this.props.assignments !== nextProps.assignments) {
			this.loadSummary(nextProps);
		}
	}


	loadSummary ({assignments} = this.props) {
		this.setState({summary: assignments.getSummary()});
	}


	render () {
		const {summary} = this.state;
		return (
			<div className="performance-view">
				<ContextSender getContext={getContext} />
				<FilterSearchBar summary={summary} />
				<SummaryTable summary={summary} />
			</div>
		);
	}
}


async function getContext () {
	const context = this;//this will be called with the contextSender's context ("this")
	return {
		label: 'Grades & Performance',
		href: context.makeHref('/performance/')
	};
}
