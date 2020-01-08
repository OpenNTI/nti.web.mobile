import React from 'react';
import PropTypes from 'prop-types';

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

	state = {
		store: this.props.assignments.getGroupedStore()
	}


	render () {
		const {props: {rootId}, state: {store}} = this;

		return rootId ?
			(<Assignment {...this.props} pageSource={store.pageSource} />) : 
			(<PageFrame pageContent={AssignmentsListView} {...this.props} />);
	}
}
