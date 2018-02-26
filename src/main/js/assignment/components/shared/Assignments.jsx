import React from 'react';
import PropTypes from 'prop-types';

import {Component as ContextSender} from 'common/mixins/ContextSender';

import Assignments from '../bindings/Assignments';

import AssignmentsListView from './AssignmentsListView';
import Assignment from './AssignmentViewer';
import PageFrame from './PageFrame';


export default
@Assignments.connect
class AssignmentsView extends React.Component {

	static propTypes = {
		assignments: PropTypes.object.isRequired,
		rootId: PropTypes.string // assignmentId, present when viewing an individual assignment
	}

	componentWillMount () {
		this.setState({store: this.props.assignments.getGroupedStore()});
	}


	render () {
		const {props: {rootId}, state: {store}} = this;

		return (
			<ContextSender>
				{rootId  ? (
					<Assignment {...this.props} pageSource={store.pageSource} />
				) : (
					<PageFrame pageContent={AssignmentsListView} {...this.props} />
				)}
			</ContextSender>
		);
	}
}
