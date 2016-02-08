import {PropTypes} from 'react';

import {decodeFromURI} from 'nti-lib-ntiids';
import ItemChanges from 'common/mixins/ItemChanges';

import AssignmentsAccessor from '../../../mixins/AssignmentCollectionAccessor';

const getAssignmentID = props => props.assignmentId
	|| ((!props.assignment || typeof props.assignment === 'string') ? props.assignment : props.assignment.getID())
	|| decodeFromURI(props.rootId);


export default {
	mixins: [AssignmentsAccessor, ItemChanges],

	propTypes: {
		//At least one of these props must be given:
		assignment: PropTypes.object,
		assignmentId: PropTypes.string,

		rootId: PropTypes.string //uri-encoded assignmentId
	},


	getItem (props = this.props) {
		const id = getAssignmentID(props);
		return id && this.getAssignments().getAssignmentSummary(id);
	},


	getAssignment (props = this.props) {
		const {assignment} = props;
		return assignment || this.getAssignments().getAssignment(getAssignmentID(props));
	},


	getStore () {
		return this.getItem();
	}
};