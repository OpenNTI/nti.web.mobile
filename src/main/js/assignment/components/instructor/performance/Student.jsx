import React from 'react';
import PropTypes from 'prop-types';
import {decorate} from '@nti/lib-commons';

import {Component as ContextSender} from 'common/mixins/ContextSender';

import Assignments from '../../bindings/Assignments';

import StudentHeader from './StudentHeader';
import StudentAssignmentsTable from './table/StudentAssignmentsTable';

class PerformanceStudent extends React.Component {

	static propTypes = {
		assignments: PropTypes.object,
		userId: PropTypes.string
	}

	render () {
		const {assignments, userId} = this.props;
		const summary = assignments.getStudentSummary(userId);

		return (
			<div>
				<ContextSender getContext={getContext} data={this.props}/>
				<StudentHeader userId={userId} />
				<StudentAssignmentsTable  userId={decodeURIComponent(userId)} items={summary || []} />
			</div>
		);
	}
}


async function getContext () {
	const contextSender = this;//this will be called with the contextSender's context ("this")

	const {data: {userId}} = contextSender.props;
	return [{
		label: 'Students',
		href: contextSender.makeHref('/performance/')
	}, {
		label: 'Student',//This is good enough
		href: contextSender.makeHref('/performance/' + userId)
	}];
}


export default decorate(PerformanceStudent, [
	Assignments.connect
]);
